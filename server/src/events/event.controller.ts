import { Controller, Post, UseInterceptors, Body, UploadedFiles, Get, Param, Delete, Put } from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ParseObjectIdPipe } from "src/common/parse-object-id.pipe";
import { imageUploadOptions } from "src/files/upload.options"
import { CreateEventDto } from "src/dto/create-event.dto"
import { EventService } from "./event.service"


@Controller('/events')
export class EventController{
    constructor(private eventService:EventService,
    ){} 
   
   @Post()
      @UseInterceptors(FileFieldsInterceptor([
          { name: 'shots', maxCount: 4 },
      ], imageUploadOptions))
      create(@Body() dto: CreateEventDto, @UploadedFiles() files: { shots?: Express.Multer.File[]}) {
          const shots = files?.shots ?? [];
          return this.eventService.create(dto, shots)
      }
    @Get()
    getAll(){
        return this.eventService.getAll()
    }
    @Get(':id')
    getOne(@Param('id', ParseObjectIdPipe) id: string){
        return this.eventService.getOne(id)
        
    }
    @Delete(':id')
    delete(@Param('id', ParseObjectIdPipe) id: string){
        return this.eventService.deleteOne(id)
    }

    
    @Delete()
    deleteAll() {
        return this.eventService.deleteAll()
    }



//     @Put(':id')
//     update(@Param('id', ParseObjectIdPipe) id: string,@Body() dto:CreateEventDto){
//         return this.eventService.updateMain(id,dto)
//     }

}