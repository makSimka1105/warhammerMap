import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PlanetService } from "./planets.service";
import { CreatePlanetDto, UpdatePlanetDto } from "src/dto/create-planet.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ParseObjectIdPipe } from "src/common/parse-object-id.pipe";
import { imageUploadOptions } from "src/files/upload.options";


@Controller('/planets')
export class PlanetController {
    constructor(private planetService: PlanetService) { }
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'pic', maxCount: 1 },
    ], imageUploadOptions))
    create(@Body() dto: CreatePlanetDto, @UploadedFiles() files: { pic?: Express.Multer.File[] }) {
        const pic = files?.pic?.[0] ?? null;
        // const images = files.images;

        return this.planetService.create(dto, pic);
    }

    @Get()
    getAll() {
        return this.planetService.getAll()
    }

    @Get(':id')
    getOne(@Param('id', ParseObjectIdPipe) id: string) {
        return this.planetService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id', ParseObjectIdPipe) id: string) {
        return this.planetService.delete(id)

    }
    @Delete()
    deleteAll() {
        return this.planetService.deleteAll()
    }


    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'pic', maxCount: 1 }], imageUploadOptions))
    update(
        @Param('id', ParseObjectIdPipe) id: string, // или ObjectId в зависимости от используемого типа
        @Body() updatePlanetDto: UpdatePlanetDto,
        @UploadedFiles() files: { pic?: Express.Multer.File[] }
    ) {
        // Вызов метода сервиса для обновления
        const pic = files?.pic?.[0] ?? null;

        return this.planetService.updatePlanet(id, updatePlanetDto, pic);
    }

}