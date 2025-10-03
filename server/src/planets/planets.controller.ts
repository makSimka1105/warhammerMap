import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PlanetService } from "./planets.service";
import { CreatePlanetDto } from "src/dto/create-planet.dto";
import { ObjectId } from "mongoose";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/planets')
export class PlanetController {
    constructor(private planetService: PlanetService) { }
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'pic', maxCount: 1 },
    ]))
    create(@Body() dto: CreatePlanetDto, @UploadedFiles() files: { pic?: Express.Multer.File[] }) {
        const pic = files.pic ? files.pic[0] : null;
        // const images = files.images;

        return this.planetService.create(dto, pic);
    }

    @Get()
    getAll() {
        return this.planetService.getAll()
    }

    @Get(':id')
    getOne(@Param('id') id: ObjectId) {
        return this.planetService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
        const Id = this.planetService.delete(id)
        return Id

    }
    @Delete()
    deleteAll() {
        return this.planetService.deleteAll()
    }


    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'pic', maxCount: 1 }]))
    update(
        @Param('id') id: string, // или ObjectId в зависимости от используемого типа
        @Body() updatePlanetDto: CreatePlanetDto,
        @UploadedFiles() files: { pic?: Express.Multer.File[] }
    ) {
        // Вызов метода сервиса для обновления
        const pic = files.pic ? files.pic[0] : null;

        return this.planetService.updatePlanet(id, updatePlanetDto, pic);
    }

}