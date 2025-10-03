import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateEventDto } from "src/dto/create-event.dto";
import { FileService } from "src/files/file.service";
import { Planet, PlanetDocument } from "src/planets/planets.schema";
import {Event, EventDocument } from "./event.schema";
import { handleInvalidIdError, handleGeneralServerError, handleObjNotFound } from "src/error-holder";


@Injectable()
export class EventService{
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
    private fileService: FileService,
    // private planetService: PlanetService,
) {}

    async create( dto: CreateEventDto,shots):Promise<Event>{
        const place=await this.planetModel.findById(dto.place)
        if(!place){
            throw Error(`not found such place:${dto.place,dto.name}`)
        }
        const eventShotsPath = await this.fileService.uploadFiles( shots,'events',dto.name);
        console.log(eventShotsPath)
        
        const event= await this.eventModel.create({
            ...dto,
            shots:eventShotsPath, 
        })
        const placeAdder= await this.planetModel.findByIdAndUpdate(
            dto.place,
            { $push:{'events':event._id}},
            {new: true, runValidators: true})
        return event
    }

    async getAll(): Promise<Event[]> {
        const events = await this.eventModel.find().exec();
        return events
    }

    async getOne(id:ObjectId):Promise<Event|null>{
            const event=await this.eventModel.findById(id).exec();
            return event
    }
    async deleteOne(id:ObjectId):Promise<{id:string|null}>{
        const deleted=await this.eventModel.findByIdAndDelete(id).exec();
        const deletedFile= await this.fileService.deleteFiles(deleted?.shots)
        const deletedLink=  await this.planetModel.findByIdAndUpdate(deleted?.place,{ $pull:{'events':id}  },
                { new: true, runValidators: true }) 

        if (!deleted) {
            handleObjNotFound(deleted, id);
                return { id: null }; // Если объект не найден, возвращаем null
            }
        return { id: deleted._id.toString()} 
    }

    async deleteAll(): Promise<Array<{id: string | null}>> {
                try {
                    const events = await this.eventModel.find().exec();
                    const deletedIds = await Promise.all(events.map(async (event) => {
                        if (!event._id){
                            handleInvalidIdError(event._id);
                            return { id: null };
                        }
                        return await this.deleteOne(event.id);
                    }))
                    return deletedIds;
                } catch (error) {
                    handleGeneralServerError(error)
                }
            }

  
}