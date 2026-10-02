import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateEventDto } from "src/dto/create-event.dto";
import { FileService } from "src/files/file.service";
import { Planet, PlanetDocument } from "src/planets/planets.schema";
import { Event, EventDocument } from "./event.schema";
import { handleGeneralServerError, handleObjNotFound } from "src/error-holder";


@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
        private fileService: FileService,
        // private planetService: PlanetService,
    ) { }

    async create(dto: CreateEventDto, shots: Express.Multer.File[]): Promise<Event> {
        const place = await this.planetModel.findById(dto.place)
        if (!place) {
            throw new NotFoundException(`Planet ${dto.place} not found`)
        }
        const eventShotsPath = await this.fileService.uploadFiles(shots)

        const event = await this.eventModel.create({
            ...dto,
            shots: eventShotsPath,
        })
        await this.planetModel.findByIdAndUpdate(
            dto.place,
            { $push: { 'events': event._id } },
            { new: true, runValidators: true })
        return event
    }

    async getAll(): Promise<Event[]> {
        const events = await this.eventModel.find().exec();
        return events
    }

    async getOne(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        handleObjNotFound(event, id)
        return event!
    }

    async deleteOne(id: string): Promise<{ id: string }> {
        const event = await this.eventModel.findById(id).exec();
        handleObjNotFound(event, id)
        await this.fileService.deleteFiles(event!.shots)
        await this.eventModel.findByIdAndDelete(id).exec();
        await this.planetModel.updateMany({ events: event!._id }, { $pull: { events: event!._id } })
        return { id: event!._id.toString() }
    }

    async deleteAll(): Promise<Array<{ id: string }>> {
        try {
            const events = await this.eventModel.find().exec();
            const deletedIds = await Promise.all(events.map(async (event) => {
                return await this.deleteOne(event.id);
            }))
            return deletedIds;
        } catch (error) {
            handleGeneralServerError(error)
        }
    }


}