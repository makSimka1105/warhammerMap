import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const MIME_EXTENSIONS: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
};

export const imageUploadOptions: MulterOptions = {
    limits: { fileSize: MAX_UPLOAD_BYTES },
    fileFilter: (_req, file, callback) => {
        if (file.mimetype in MIME_EXTENSIONS) {
            callback(null, true);
            return;
        }
        callback(new BadRequestException('Only png, jpeg and webp images are allowed'), false);
    },
};
