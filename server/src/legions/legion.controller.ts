import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { LegionService } from "./legion.service";
import { CreateLegionDto } from "src/dto/create-legion.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/legions')
export class LegionController {
    constructor(private legionService: LegionService,
    ) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'icon', maxCount: 1 },
    ]))
    create(@Body() dto: CreateLegionDto, @UploadedFiles() files: { icon?: Express.Multer.File[]}) {
        const icon = files.icon ? files.icon[0] : null;
        return this.legionService.create(dto, icon)
    }
    @Get()
    getAll() {
        return this.legionService.getAll()
    }
    @Get(':id')
    getOne(@Param('id') id: ObjectId) {
        return this.legionService.getOne(id)

    }
    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
        return this.legionService.delete(id)
    }


    @Delete()
    deleteAll() {
        return this.legionService.deleteAll()
    }



    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'icon', maxCount: 1 }]))

    update(@Param('id') id: string, @Body() dto: CreateLegionDto, @UploadedFiles() files: { icon?: Express.Multer.File[]}) {
        const icon = files.icon ? files.icon[0] : null;
        
        return this.legionService.update(id, dto,icon)
    }

}