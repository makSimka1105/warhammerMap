import { Injectable, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateEventDto } from "src/dto/create-event.dto";
import { UpdateEventDto } from "src/dto/update-event.dto";
import { FileService } from "src/files/file.service";
import { Planet, PlanetDocument } from "src/planets/planets.schema";
import { Event, EventDocument } from "./event.schema";
import { handleObjNotFound } from "src/error-holder";

const EXPORT_LIMIT = 10000;

type ExportedEvent = Event & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };


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

    async exportAll() {
        if (await this.eventModel.countDocuments().exec() > EXPORT_LIMIT) {
            throw new PayloadTooLargeException('Too many events for export');
        }
        const events = await this.eventModel.find().sort({ createdAt: 1, _id: 1 }).lean<ExportedEvent[]>().exec();
        const places = await this.planetModel.find({ _id: { $in: events.map((event) => event.place) } }).lean().exec();
        const placeById = new Map(places.map((place) => [place._id.toString(), place]));
        return {
            exportedAt: new Date().toISOString(),
            events: events.map((event) => {
                const place = placeById.get(event.place.toString());
                return {
                    id: event._id.toString(),
                    name: event.name,
                    description: event.description ?? null,
                    link: event.link ?? null,
                    shots: event.shots ?? [],
                    place: place ? {
                        id: place._id.toString(),
                        name: place.name,
                        size: place.size,
                        top: place.top,
                        left: place.left,
                        ingamePosition: place.ingamePosition ?? null,
                        pic: place.pic ?? null,
                        description: place.description ?? null,
                    } : null,
                    createdAt: event.createdAt.toISOString(),
                    updatedAt: event.updatedAt.toISOString(),
                };
            }),
        };
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
