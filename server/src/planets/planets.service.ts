import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Planet, PlanetDocument } from "./planets.schema";
import { CreatePlanetDto, UpdatePlanetDto } from "src/dto/create-planet.dto";
import { handleInvalidIdError, handleObjNotFound, handleGeneralServerError } from "src/error-holder";
import { Legion, LegionDocument } from "src/legions/legion.schema";
import { FileService } from "src/files/file.service";
import { Event, EventDocument } from "src/events/event.schema";


@Injectable()
export class PlanetService {
    constructor(@InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
        @InjectModel(Legion.name) private legionModel: Model<LegionDocument>,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        private fileService: FileService,
    ) { }

    async create(dto: CreatePlanetDto, pic): Promise<Planet> {
        const { legion1, legion2, ...planetFields } = dto;
        const legionIds = await this.resolveLegions([legion1, legion2]);
        const picName = await this.fileService.uploadFile(pic);
        let planet: PlanetDocument;
        try {
            planet = await this.planetModel.create({ ...planetFields, pic: picName, legions: legionIds });
        } catch (error) {
            await this.fileService.deleteFile(picName);
            throw error;
        }
        try {
            await this.linkLegions(planet._id, legionIds);
        } catch (error) {
            await this.planetModel.deleteOne({ _id: planet._id });
            await this.fileService.deleteFile(picName);
            throw error;
        }
        return this.getListed(planet._id);
    }

    async getAll(): Promise<Planet[]> {
        return this.planetModel.find().populate('events').exec();
    }

    async getOne(id: string): Promise<Planet | null> {
        handleInvalidIdError(id)
        try {
            const planet = await this.planetModel.findById(id).populate(['legions', 'events']).exec()
            handleObjNotFound(planet, id)
            return planet
        } catch (error) {
            handleGeneralServerError(error)
        }
    }

    async delete(id: string): Promise<{ id: string }> {
        const planet = await this.planetModel.findById(id).exec();
        if (!planet) {
            throw new NotFoundException(`Object with id ${id} not found`);
        }
        const events = await this.eventModel.find({ $or: [{ _id: { $in: planet.events } }, { place: planet._id }] }).exec();
        await this.legionModel.updateMany({ planets: planet._id }, { $pull: { planets: planet._id } });
        await this.eventModel.deleteMany({ _id: { $in: events.map((event) => event._id) } });
        await this.planetModel.deleteOne({ _id: planet._id });
        await this.fileService.deleteFiles([planet.pic, ...events.flatMap((event) => event.shots)]);
        return { id: planet._id.toString() };
    }

    async deleteAll(): Promise<Array<{ id: string }>> {
        const planets = await this.planetModel.find().exec();
        const events = await this.eventModel.find().exec();
        await this.legionModel.updateMany({}, { $set: { planets: [] } });
        await this.eventModel.deleteMany({});
        await this.planetModel.deleteMany({});
        await this.fileService.deleteFiles([
            ...planets.map((planet) => planet.pic),
            ...events.flatMap((event) => event.shots),
        ]);
        return planets.map((planet) => ({ id: planet._id.toString() }));
    }

    async updatePlanet(id: string, dto: UpdatePlanetDto, pic: Express.Multer.File | null): Promise<Planet> {
        const planet = await this.planetModel.findById(id);
        if (!planet) {
            throw new NotFoundException(`Planet with id ${id} not found`);
        }
        const [currentFirst, currentSecond] = planet.legions.map(String);
        const legionIds = await this.resolveLegions([dto.legion1 ?? currentFirst, dto.legion2 ?? currentSecond]);
        const oldPic = planet.pic;
        const newPic = pic ? await this.fileService.uploadFile(pic) : null;
        planet.name = dto.name ?? planet.name;
        planet.ingamePosition = dto.ingamePosition ?? planet.ingamePosition;
        planet.description = dto.description ?? planet.description;
        planet.left = dto.left ?? planet.left;
        planet.top = dto.top ?? planet.top;
        planet.size = dto.size ?? planet.size;
        planet.legions = legionIds;
        planet.pic = newPic ?? oldPic;
        try {
            await planet.save();
        } catch (error) {
            await this.fileService.deleteFile(newPic);
            throw error;
        }
        await this.legionModel.updateMany(
            { planets: planet._id, _id: { $nin: legionIds } },
            { $pull: { planets: planet._id } },
        );
        await this.linkLegions(planet._id, legionIds);
        if (newPic) {
            await this.fileService.deleteFile(oldPic);
        }
        return this.getListed(planet._id);
    }

    private async getListed(id: Types.ObjectId): Promise<PlanetDocument> {
        return (await this.planetModel.findById(id).populate('events').exec())!;
    }

    private linkLegions(planetId: Types.ObjectId, legionIds: Types.ObjectId[]) {
        return this.legionModel.updateMany({ _id: { $in: legionIds } }, { $addToSet: { planets: planetId } });
    }

    private async resolveLegions(requested: Array<string | undefined>): Promise<Types.ObjectId[]> {
        const wanted = [...new Set(requested.filter((legionId): legionId is string => !!legionId).map((legionId) => legionId.toLowerCase()))];
        if (wanted.length === 0) {
            return [];
        }
        const found = await this.legionModel.find({ _id: { $in: wanted } }, { _id: 1 }).exec();
        const missing = wanted.filter((legionId) => !found.some((legion) => legion.id === legionId));
        if (missing.length > 0) {
            throw new NotFoundException(`Legion ${missing.join(', ')} not found`);
        }
        return wanted.map((legionId) => found.find((legion) => legion.id === legionId)!._id);
    }
}
