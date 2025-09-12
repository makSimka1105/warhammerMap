import { Controller, Post, UseInterceptors, Body, UploadedFiles, Get, Param, Delete, Put } from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ObjectId } from "mongoose"
import { CreateEventDto } from "src/dto/create-event.dto"
import { EventService } from "./event.service"


@Controller('/events')
export class EventController{
    constructor(private eventService:EventService,
    ){} 
   
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'shots', maxCount: 5 },
    ]))
    create(@Body() dto:CreateEventDto, @UploadedFiles() filles ){
        const {shots} =filles
        return this.eventService.create(dto,shots)
    }
    @Get()
    getAll(){
        return this.eventService.getAll()
    }
    @Get(':id')
    getOne(@Param('id') id: ObjectId){
        return this.eventService.getOne(id)
        
    }
    @Delete(':id')
    delete(@Param('id') id:ObjectId){
        return this.eventService.deleteOne(id)
    }

    
    @Delete()
    deleteAll() {
        return this.eventService.deleteAll()
    }



//     @Put(':id')
//     update(@Param('id') id: ObjectId,@Body() dto:CreateEventDto){
//         return this.eventService.updateMain(id,dto)
//     }

}