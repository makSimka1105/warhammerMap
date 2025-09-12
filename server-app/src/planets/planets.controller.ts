import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PlanetService } from "./planets.service";
import { CreatePlanetDto } from "src/dto/create-planet.dto";
import { ObjectId } from "mongoose";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/planets')
export class PlanetController{
    constructor(private planetService:PlanetService){}
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'pic', maxCount: 1 },
    ]))
    create(@Body() dto:CreatePlanetDto,@UploadedFiles() files){
        const { pic } = files;
        return this.planetService.create(dto,pic[0]);
    }

    @Get()
    getAll(){
        return this.planetService.getAll()
    }

    @Get(':id')
    getOne(@Param('id') id: ObjectId){
        return this.planetService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id: ObjectId){
        const Id =this.planetService.delete(id)
        return Id

    }
    @Delete()
    deleteAll() {
        return this.planetService.deleteAll()
    }


    @Put(':id')
    update(@Param('id') id: ObjectId,@Body() legion:ObjectId|string){
        return this.planetService.deleteLegion(id,legion)
    }
    
}