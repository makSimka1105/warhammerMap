import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, mongo, Types } from 'mongoose';
import { Readable } from 'stream';
import { extensionFor, MIME_EXTENSIONS } from './upload.options';

export const IMAGES_BUCKET = 'images';

const EXTENSIONS = Object.values(MIME_EXTENSIONS).join('|');
const STORED_NAME = new RegExp(`^([0-9a-f]{24})\\.(${EXTENSIONS})$`);

export interface StoredImage {
    id: Types.ObjectId;
    contentType: string;
    length: number;
}

@Injectable()
export class FileService {
    private bucket?: mongo.GridFSBucket;

    constructor(@InjectConnection() private readonly connection: Connection) {}

    async uploadFile(file: { mimetype: string; buffer: Buffer } | null | undefined): Promise<string> {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }
        const ext = extensionFor(file.mimetype);
        if (!ext) {
            throw new BadRequestException('Unsupported file type');
        }
        const id = new Types.ObjectId();
        const name = `${id}.${ext}`;
        await new Promise<void>((resolve, reject) => {
            this.getBucket()
                .openUploadStreamWithId(id, name, { contentType: file.mimetype })
                .once('error', reject)
                .once('finish', () => resolve())
                .end(file.buffer);
        });
        return name;
    }

    uploadFiles(files: Array<{ mimetype: string; buffer: Buffer }>): Promise<string[]> {
        return Promise.all(files.map((file) => this.uploadFile(file)));
    }

    async deleteFile(stored: string | undefined | null): Promise<void> {
        const id = this.parseStoredName(stored)?.id;
        if (!id) return;
        try {
            await this.getBucket().delete(id);
        } catch (error) {
            if (!(error instanceof mongo.MongoRuntimeError) || !/File not found/.test(error.message)) {
                throw error;
            }
        }
    }

    async deleteFiles(stored: Array<string | undefined | null> | undefined | null): Promise<void> {
        await Promise.all((stored ?? []).map((name) => this.deleteFile(name)));
    }

    async find(name: string): Promise<StoredImage | null> {
        const parsed = this.parseStoredName(name);
        if (!parsed) return null;
        const [file] = await this.getBucket().find({ _id: parsed.id }).limit(1).toArray();
        if (!file || file.filename !== name) return null;
        return { id: parsed.id, contentType: file.contentType ?? 'application/octet-stream', length: file.length };
    }

    openDownload(id: Types.ObjectId): Readable {
        return this.getBucket().openDownloadStream(id);
    }

    private parseStoredName(name: string | undefined | null) {
        const match = name ? STORED_NAME.exec(name) : null;
        return match ? { id: new Types.ObjectId(match[1]), ext: match[2] } : null;
    }

    private getBucket(): mongo.GridFSBucket {
        if (!this.bucket) {
            this.bucket = new mongo.GridFSBucket(this.connection.db!, { bucketName: IMAGES_BUCKET });
        }
        return this.bucket;
    }
}
