import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { LegionService } from "./legion.service";
import { CreateLegionDto} from "src/dto/create-legion.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/legions')
export class LegionController{
    constructor(private legionService:LegionService,
    ){} 
   
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'icon', maxCount: 1 },
    ]))
    create(@Body() dto:CreateLegionDto, @UploadedFiles() filles ){
        const {icon} =filles
        return this.legionService.create(dto,icon[0])
    }
    @Get()
    getAll(){
        return this.legionService.getAll()
    }
    @Get(':id')
    getOne(@Param('id') id: ObjectId){
        return this.legionService.getOne(id)
        
    }
    @Delete(':id')
    delete(@Param('id') id:ObjectId){
        return this.legionService.delete(id)
    }

    
    @Delete()
    deleteAll() {
        return this.legionService.deleteAll()
    }



    @Put(':id')
    update(@Param('id') id: ObjectId,@Body() dto:CreateLegionDto){
        return this.legionService.updateMain(id,dto)
    }

}