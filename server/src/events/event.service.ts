import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateEventDto } from "src/dto/create-event.dto";
import { UpdateEventDto } from "src/dto/update-event.dto";
import { FileService } from "src/files/file.service";
import { Planet, PlanetDocument } from "src/planets/planets.schema";
import { Event, EventDocument } from "./event.schema";
import { handleObjNotFound } from "src/error-holder";


@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
        private fileService: FileService,
    ) { }

    async create(dto: CreateEventDto, shots: Express.Multer.File[]): Promise<Event> {
        const place = await this.planetModel.findById(dto.place)
        if (!place) {
            throw new NotFoundException(`Planet ${dto.place} not found`)
        }
        const shotNames = await this.fileService.uploadFiles(shots)

        let event: EventDocument
        try {
            event = await this.eventModel.create({ ...dto, shots: shotNames })
        } catch (error) {
            await this.fileService.deleteFiles(shotNames)
            throw error
        }
        try {
            await this.planetModel.updateOne({ _id: event.place }, { $addToSet: { events: event._id } })
        } catch (error) {
            await this.eventModel.deleteOne({ _id: event._id })
            await this.fileService.deleteFiles(shotNames)
            throw error
        }
        return event
    }

    async getAll(): Promise<Event[]> {
        return this.eventModel.find().exec()
    }

    async getOne(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        handleObjNotFound(event, id)
        return event!
    }

    async update(id: string, dto: UpdateEventDto): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        handleObjNotFound(event, id);

        const nextPlace = dto.place ?? event!.place.toString();
        const place = await this.planetModel.findById(nextPlace).exec();
        if (!place) {
            throw new NotFoundException(`Planet ${nextPlace} not found`);
        }

        const changes = Object.entries(dto).filter(([, value]) => value !== undefined);
        Object.assign(event!, Object.fromEntries(changes));
        event!.place = place._id;
        await event!.save();

        await this.planetModel.updateMany({ events: event!._id, _id: { $ne: place._id } }, { $pull: { events: event!._id } });
        await this.planetModel.updateOne({ _id: place._id }, { $addToSet: { events: event!._id } });
        return event!;
    }

    async deleteOne(id: string): Promise<{ id: string }> {
        const event = await this.eventModel.findByIdAndDelete(id).exec();
        handleObjNotFound(event, id)
        await this.planetModel.updateMany({ events: event!._id }, { $pull: { events: event!._id } })
        await this.fileService.deleteFiles(event!.shots)
        return { id: event!._id.toString() }
    }

    async deleteAll(): Promise<Array<{ id: string }>> {
        const events = await this.eventModel.find().exec();
        await this.planetModel.updateMany({}, { $set: { events: [] } })
        await this.eventModel.deleteMany({})
        await this.fileService.deleteFiles(events.flatMap((event) => event.shots))
        return events.map((event) => ({ id: event._id.toString() }))
    }
}
