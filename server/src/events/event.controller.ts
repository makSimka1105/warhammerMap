import { Controller, Post, UseInterceptors, Body, UploadedFiles, Get, Param, Delete, Put, Res } from "@nestjs/common"
import { Response } from 'express';
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ParseObjectIdPipe } from "src/common/parse-object-id.pipe";
import { imageUploadOptions } from "src/files/upload.options"
import { CreateEventDto } from "src/dto/create-event.dto"
import { UpdateEventDto } from "src/dto/update-event.dto"
import { EventService } from "./event.service"
import { RequireAdmin } from "src/auth/admin.decorator"


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
    @Get('export')
    @RequireAdmin()
    async export(@Res() response: Response) {
        const body = await this.eventService.exportAll();
        const date = body.exportedAt.slice(0, 10).replaceAll('-', '');
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Content-Disposition', `attachment; filename="events-${date}.json"`);
        return response.status(200).json(body);
    }
    @Get(':id')
    getOne(@Param('id', ParseObjectIdPipe) id: string){
        return this.eventService.getOne(id)
        
    }
    @Put(':id')
    update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateEventDto) {
        return this.eventService.update(id, dto)
    }
    @Delete(':id')
    delete(@Param('id', ParseObjectIdPipe) id: string){
        return this.eventService.deleteOne(id)
    }

    
    @Delete()
    deleteAll() {
        return this.eventService.deleteAll()
    }
}
