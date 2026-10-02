import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('/files')
export class FilesController {
    constructor(private readonly fileService: FileService) {}

    @Get(':name')
    async getOne(@Param('name') name: string, @Res() res: Response) {
        const image = await this.fileService.find(name);
        if (!image) {
            throw new NotFoundException('File not found');
        }
        res.set({
            'Content-Type': image.contentType,
            'Content-Length': String(image.length),
            'Cache-Control': 'public, max-age=31536000, immutable',
        });
        this.fileService.openDownload(image.id).once('error', (error) => res.destroy(error)).pipe(res);
    }
}
