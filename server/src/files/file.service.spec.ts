import { BadRequestException } from '@nestjs/common';
import { promises as fsp } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileService } from './file.service';
import { imageUploadOptions } from './upload.options';

describe('FileService', () => {
    let root: string;
    let service: FileService;

    beforeEach(async () => {
        root = await fsp.mkdtemp(path.join(os.tmpdir(), 'static-'));
        service = new FileService(root);
    });

    afterEach(async () => {
        await fsp.rm(root, { recursive: true, force: true });
    });

    const png = { mimetype: 'image/png', buffer: Buffer.from('png-bytes') };

    it('stores <uuid>.<ext> under the category and returns an extension-less path', async () => {
        const stored = await service.uploadFile(png, 'icons');

        expect(stored).toMatch(/^icons\/[0-9a-f-]{36}$/);
        const content = await fsp.readFile(path.join(root, `${stored}.png`));
        expect(content.toString()).toBe('png-bytes');
    });

    it('rejects an unsupported mime type', async () => {
        await expect(service.uploadFile({ mimetype: 'text/html', buffer: Buffer.alloc(0) }, 'icons'))
            .rejects.toBeInstanceOf(BadRequestException);
    });

    it('deletes only the file it was asked to', async () => {
        const first = await service.uploadFile(png, 'icons');
        const second = await service.uploadFile(png, 'icons');

        await service.deleteFile(first);

        await expect(fsp.access(path.join(root, `${first}.png`))).rejects.toThrow();
        await expect(fsp.access(path.join(root, `${second}.png`))).resolves.toBeUndefined();
    });

    it('rejects names that resolve outside the static root', async () => {
        const outside = path.join(path.dirname(root), `outside-${path.basename(root)}`);
        await fsp.writeFile(`${outside}.png`, 'keep');

        await expect(service.deleteFile('../../etc/passwd')).rejects.toBeInstanceOf(BadRequestException);
        await expect(service.deleteFile(`../${path.basename(outside)}`)).rejects.toBeInstanceOf(BadRequestException);
        expect((await fsp.readFile(`${outside}.png`)).toString()).toBe('keep');

        await fsp.rm(`${outside}.png`);
    });

    it('skips old-format values without touching the directory', async () => {
        const legacyDir = path.join(root, 'icons', 'Terra');
        await fsp.mkdir(legacyDir, { recursive: true });
        await fsp.writeFile(path.join(legacyDir, 'abc.png'), 'old');

        await service.deleteFile('icons/Terra/abc');

        await expect(fsp.access(path.join(legacyDir, 'abc.png'))).resolves.toBeUndefined();
    });

    it('ignores names outside the known categories', async () => {
        await fsp.writeFile(path.join(root, 'x.png'), 'root file');

        await service.deleteFile('./x');

        await expect(fsp.access(path.join(root, 'x.png'))).resolves.toBeUndefined();
    });

    it('rejects a missing file with 400', async () => {
        await expect(service.uploadFile(undefined, 'icons')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects mime types that only exist on Object.prototype', async () => {
        await expect(service.uploadFile({ mimetype: 'constructor', buffer: Buffer.alloc(0) }, 'icons'))
            .rejects.toBeInstanceOf(BadRequestException);
        expect(await fsp.readdir(root)).toEqual([]);
    });
});

describe('imageUploadOptions.fileFilter', () => {
    const run = (mimetype: string) => {
        const callback = jest.fn();
        imageUploadOptions.fileFilter!({} as any, { mimetype } as any, callback);
        return callback;
    };

    it('accepts png, jpeg and webp', () => {
        for (const mime of ['image/png', 'image/jpeg', 'image/webp']) {
            expect(run(mime)).toHaveBeenCalledWith(null, true);
        }
    });

    it('rejects a non-image mime with 400', () => {
        const callback = run('application/pdf');
        expect(callback.mock.calls[0][0]).toBeInstanceOf(BadRequestException);
        expect(callback.mock.calls[0][1]).toBe(false);
    });

    it('rejects prototype keys as mime types', () => {
        for (const mime of ['constructor', 'toString', '__proto__']) {
            expect(run(mime).mock.calls[0][1]).toBe(false);
        }
    });

    it('limits files to 5 MB', () => {
        expect(imageUploadOptions.limits?.fileSize).toBe(5 * 1024 * 1024);
    });
});
