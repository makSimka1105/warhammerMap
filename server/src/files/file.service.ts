import { BadRequestException, Inject, Injectable, Optional } from "@nestjs/common";
import { promises as fsp } from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { extensionFor, MIME_EXTENSIONS } from "./upload.options";

export const STATIC_ROOT = 'STATIC_ROOT';

const STORED_NAME = /^(icons|legions|events)\/[0-9a-f-]{36}$/;

@Injectable()
export class FileService {
    private readonly staticRoot: string;

    constructor(@Optional() @Inject(STATIC_ROOT) staticRoot?: string) {
        this.staticRoot = path.resolve(staticRoot ?? path.join(__dirname, '..', 'static'));
    }

    async uploadFile(file, category: string) {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }
        const ext = extensionFor(file.mimetype);
        if (!ext) {
            throw new BadRequestException('Unsupported file type');
        }
        const id = uuid.v4();
        const dir = path.join(this.staticRoot, category);
        await fsp.mkdir(dir, { recursive: true });
        await fsp.writeFile(path.join(dir, `${id}.${ext}`), file.buffer);
        return `${category}/${id}`;
    }

    async uploadFiles(files: [], category: string) {
        return Promise.all(files.map((file) => this.uploadFile(file, category)));
    }

    async deleteFile(fileName: string | undefined): Promise<void> {
        if (!fileName) return;
        const target = path.resolve(this.staticRoot, fileName);
        if (!target.startsWith(this.staticRoot + path.sep)) {
            throw new BadRequestException('Invalid file name');
        }
        if (!STORED_NAME.test(fileName)) return;
        await Promise.all(Object.values(MIME_EXTENSIONS).map(async (ext) => {
            try {
                await fsp.unlink(`${target}.${ext}`);
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
            }
        }));
    }

    async deleteFiles(fillesNames: string[] | undefined) {
        if (fillesNames == undefined) { throw new Error('файлы не получены') }

        const deletedFiles = await Promise.all(fillesNames.map(async (fileName) => {
            try {
                return this.deleteFile(fileName)
            } catch (error) {
                console.log('не удалос удалить файл', fileName, error)
                throw new Error(error)
            }
        }))
        console.log(deletedFiles)
        return deletedFiles
    }
}