import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { Error, ObjectId } from "mongoose";
import * as path from 'path';
import * as uuid from 'uuid';
import { rm } from "fs/promises";


@Injectable()
export class FileService {

    async uploadFile(fille, category: string, folderName: string) {
        try {
            const fileExt = fille.originalname.split('.').pop();
            const filleName = uuid.v4()
            const fillePath = path.resolve(__dirname, '..', 'static', category, folderName);
            if (!fs.existsSync(fillePath)) {
                fs.mkdirSync(fillePath, { recursive: true });
            }
            const fullPath = path.resolve(fillePath, `${filleName}.${fileExt}`);
            fs.writeFileSync(fullPath, fille.buffer)
            return `${category}/${folderName}/${filleName}`;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('File upload failed');

        }

    }

    async uploadFiles(filles: [], category: string, folderName: string) {
        const shotsNames = await Promise.all(filles.map(async (fille) => {
            return await this.uploadFile(fille, category, folderName)
        }))
        console.log(shotsNames)
        return shotsNames;
    }




    async deleteFile(fileName: string | undefined): Promise<string | void> {
        try {
            if (fileName) {
                const filePath = path.resolve(__dirname, '..', 'static', fileName);

                // Получаем путь к папке с файлом
                const folderPath = path.dirname(filePath);
                console.log(folderPath)
                const deleted = await rm(folderPath, { recursive: true, force: true });                // const deleted = path.resolve(__dirname, '..', 'static', fileName);
                // await fs.unlink(deleted + '.png', (err) => {
                //     if (err) {
                //         console.log('Error deleting file:', deleted, err);
                //         return
                //     }
                // })

                console.log('файл удален')
                return deleted
            }
        } catch (error) {
            throw new Error(error)
        }
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


    async updateFile(origFileName: string, newFile) {
        try {
            const origFillePath = path.resolve(__dirname, '..', 'static', origFileName);
            if (!fs.existsSync(origFillePath)) {
                throw new Error('File updating failed because no original file');
            }
            fs.writeFileSync(origFillePath, newFile.buffer)
            return origFillePath
        } catch (error) {
            console.error('Error updating file:', error);
            throw new Error('File updating failed');
        }
    }


}