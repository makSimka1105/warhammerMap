import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection, createConnection } from 'mongoose';
import * as request from 'supertest';
import { FileService } from './file.service';
import { FilesController } from './files.controller';
import { imageUploadOptions } from './upload.options';

const MONGO_URL = process.env.MONGO_TEST_URL ?? 'mongodb://localhost:27017';
const PNG = { mimetype: 'image/png', buffer: Buffer.from('png-bytes') };

describe('FileService and FilesController on GridFS', () => {
    let connection: Connection;
    let service: FileService;
    let app: INestApplication;

    beforeAll(async () => {
        connection = await createConnection(`${MONGO_URL}/wh_test_${Date.now()}_${process.pid}`).asPromise();
        service = new FileService(connection);
        const module = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [{ provide: FileService, useValue: service }],
        }).compile();
        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await connection.dropDatabase();
        await connection.close();
    });

    it('stores an image as <objectId>.<ext>', async () => {
        expect(await service.uploadFile(PNG)).toMatch(/^[0-9a-f]{24}\.png$/);
        expect(await service.uploadFile({ ...PNG, mimetype: 'image/jpeg' })).toMatch(/\.jpg$/);
        expect(await service.uploadFile({ ...PNG, mimetype: 'image/webp' })).toMatch(/\.webp$/);
    });

    it('streams it back with content type and immutable cache headers', async () => {
        const name = await service.uploadFile(PNG);

        const res = await request(app.getHttpServer()).get(`/files/${name}`).expect(200);

        expect(res.headers['content-type']).toBe('image/png');
        expect(res.headers['cache-control']).toBe('public, max-age=31536000, immutable');
        expect(res.body.toString()).toBe('png-bytes');
    });

    it('answers 404 for missing, malformed and mismatched names', async () => {
        const name = await service.uploadFile(PNG);
        const wrongExt = name.replace('.png', '.jpg');

        for (const bad of ['000000000000000000000000.png', 'nope', '..%2F..%2Fetc', wrongExt]) {
            await request(app.getHttpServer()).get(`/files/${bad}`).expect(404);
        }
    });

    it('deletes by stored value and tolerates repeats', async () => {
        const name = await service.uploadFile(PNG);

        await service.deleteFile(name);
        await service.deleteFile(name);

        await request(app.getHttpServer()).get(`/files/${name}`).expect(404);
    });

    it('does not delete anything for values that are not <24-hex>.<ext>', async () => {
        const name = await service.uploadFile(PNG);

        await service.deleteFile('icons/Terra/abc');
        await service.deleteFile(name.split('.')[0]);
        await service.deleteFiles(undefined);

        await request(app.getHttpServer()).get(`/files/${name}`).expect(200);
    });

    it('rejects a missing file and unsupported or prototype mime types with 400', async () => {
        await expect(service.uploadFile(undefined)).rejects.toBeInstanceOf(BadRequestException);
        for (const mimetype of ['text/html', 'constructor']) {
            await expect(service.uploadFile({ mimetype, buffer: Buffer.alloc(0) })).rejects.toBeInstanceOf(BadRequestException);
        }
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

    it('limits files to 4 MB', () => {
        expect(imageUploadOptions.limits?.fileSize).toBe(4 * 1024 * 1024);
    });
});
