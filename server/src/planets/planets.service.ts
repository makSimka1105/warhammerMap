import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Planet, PlanetDocument } from "./planets.schema";
import { CreatePlanetDto, UpdatePlanetDto } from "src/dto/create-planet.dto";
import { handleInvalidIdError, handleObjNotFound, handleGeneralServerError } from "src/error-holder";
import { Legion, LegionDocument } from "src/legions/legion.schema";
import { LegionService } from "src/legions/legion.service";
import { FileService } from "src/files/file.service";
import { Event, EventDocument } from "src/events/event.schema";


@Injectable()
export class PlanetService {
    constructor(@InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
        @InjectModel(Legion.name) private legionModel: Model<LegionDocument>,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        private legionService: LegionService,
        private fileService: FileService,

    ) { }
    async create(dto: CreatePlanetDto, pic): Promise<Planet> {

        const { legion1, legion2, ...planetData } = dto;

        const legions: string[] = []
        if (legion1) { legions.push(legion1) }
        if (legion2) { legions.push(legion2) }
        // console.log(legions)
        const legionSelfs = await Promise.all(legions.map(async link => {
            const founded = await this.legionModel.findById(link)
            if (founded == null) throw new NotFoundException(`Legion ${link} not found`)
            return founded
        }))

        const legionsIds = legionSelfs.map(g => {
            if (g) {
                return g._id
            }
        })
        const picPath = await this.fileService.uploadFile(pic);
        const createdPlanet = await this.planetModel.create({
            ...planetData,
            pic: picPath,
            legions: legionsIds,

        });
        await Promise.all(legionSelfs.map(async legion => {

            legion.planets.push(createdPlanet._id);
            await legion.save();

        }))



        return createdPlanet;
    }


    async getAll(): Promise<Planet[]> {
        const planets = await this.planetModel.find().populate('events').exec();
        return planets
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

    async delete(id: string): Promise<{ id: string | null }> {

        try {
            // First find the planet to get its groups
            handleInvalidIdError(id);
            const planet = await this.planetModel.findById(id).exec();
            if (!planet) {
                handleObjNotFound(null, id);
                return { id: null };
            }
            // Delete all references to this planet in groups
            const legions = planet.legions
            if (legions) {
                await Promise.all(legions.map(async (groupId) => {

                    handleInvalidIdError(id)
                    await this.legionService.deletePlanet(groupId, id);
                }));
            }
            // Delete the planet's file if it exists
            if (planet.pic) {
                await this.fileService.deleteFile(planet.pic);
            }
            
            const events = await this.eventModel.find({ _id: { $in: planet.events } }).exec();
            await this.fileService.deleteFiles(events.flatMap(event => event.shots));
            await this.eventModel.deleteMany({ _id: { $in: events.map(event => event._id) } });
            
            // Finally delete the planet itself
            await this.planetModel.findByIdAndDelete(id).exec();
            return { id: planet._id.toString() };
        } catch (error) {
            handleGeneralServerError(error);
        }
    }

    async deleteAll(): Promise<Array<{ id: string | null }>> {
        try {
            const planets = await this.planetModel.find().exec();
            const deletedIds = await Promise.all(planets.map(async (planet) => {
                if (!planet._id) {
                    handleInvalidIdError(planet._id);
                    return { id: null };
                }
                return await this.delete(planet.id);
            }))
            return deletedIds;
        } catch (error) {
            handleGeneralServerError(error)
        }
    }



    // async deleteLegion(id: ObjectId | string, legion: ObjectId | string): Promise<Planet | null> {
    //     handleInvalidIdError(id);
    //     try {
    //         const updatedPlanet = await this.planetModel.findByIdAndUpdate(
    //             id,
    //             { $pull: { 'legions': legion } },
    //             { new: true, runValidators: true })
    //         handleObjNotFound(updatedPlanet, id)
    //         return updatedPlanet;
    //     } catch (error) {
    //         handleGeneralServerError(error);
    //     }
    // }
    async updatePlanet(id: string, dto: UpdatePlanetDto, pic: Express.Multer.File | null): Promise<Planet> {
        handleInvalidIdError(id);
        // Найти текущий документ планеты
        const planet = await this.planetModel.findById(id);
        if (!planet) {
            throw new NotFoundException(`Planet with id ${id} not found`);
        }

        // Обработка легионов из dto
        const legionsToUpdate: string[] = [];

        if (dto.legion1 === undefined && dto.legion2 === undefined) {
            legionsToUpdate.push(...planet.legions.map(String));
        }
        if (dto.legion1 === "") {
            // Remove legion1
        } else if (dto.legion1 !== undefined) {
            legionsToUpdate.push(dto.legion1);
        }

        if (dto.legion2 === "") {
            // Remove legion2
        } else if (dto.legion2 !== undefined) {
            legionsToUpdate.push(dto.legion2);
        }

        // Проверить легионы и получить их документы
        const legionInstances = await Promise.all(legionsToUpdate.map(async (legionId) => {
            const legion = await this.legionModel.findById(legionId);
            if (!legion) throw new NotFoundException(`Legion ${legionId} not found`);
            return legion;
        }));

        const legionsIds = legionInstances.map(l => l._id);

        // Загрузить новую иконку, если она есть, иначе оставить старую
        const picPath = pic ? await this.fileService.uploadFile(pic) : planet.pic;

        // Удалить планету из легионов, которые были раньше, но не используются сейчас
        const oldLegions = planet.legions.map(id => id.toString());
        for (const legionId of oldLegions) {
            

            await this.legionService.deletePlanet(legionId, id);

        }

        // Добавить планету в новые легионы, если ещё нет
        for (const legion of legionInstances) {
                legion.planets.push(planet._id);
                await legion.save();
            
        }

        // Обновить поля планеты
        planet.name = dto.name ?? planet.name;
        planet.ingamePosition = dto.ingamePosition ?? planet.ingamePosition;
        planet.description = dto.description ?? planet.description;
        planet.left = dto.left ?? planet.left;
        planet.top = dto.top ?? planet.top;
        planet.size = dto.size ?? planet.size;
        planet.legions =  legionsIds ;
        const oldPic = planet.pic;
        planet.pic = picPath;
        await planet.save();
        if (pic && oldPic) {
            await this.fileService.deleteFile(oldPic);
        }

        return planet;
    }

}


