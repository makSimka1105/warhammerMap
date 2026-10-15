import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Legion, LegionDocument } from "./legion.schema";
import { CreateLegionDto, UpdateLegionDto } from "src/dto/create-legion.dto";
import { handleInvalidIdError, handleObjNotFound, handleGeneralServerError } from "src/error-holder";
import { FileService } from "src/files/file.service";
import { Planet, PlanetDocument } from "src/planets/planets.schema";


@Injectable()
export class LegionService {
    constructor(@InjectModel(Legion.name) private legionModel: Model<LegionDocument>,
        @InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
        private fileService: FileService,
    ) { }

    async create(dto: CreateLegionDto, icon): Promise<Legion> {
        const iconName = await this.fileService.uploadFile(icon);
        try {
            return await this.legionModel.create({ ...dto, planets: [], icon: iconName })
        } catch (error) {
            await this.fileService.deleteFile(iconName)
            throw error
        }
    }

    async getAll(): Promise<Legion[]> {
        return this.legionModel.find().exec();
    }

    async getOne(id: string): Promise<Legion | null> {
        handleInvalidIdError(id)
        try {
            const legion = await this.legionModel.findById(id).populate('planets').exec();
            handleObjNotFound(legion, id)
            return legion
        } catch (error) {
            handleGeneralServerError(error)
        }
    }

    async delete(id: string): Promise<{ id: string }> {
        const legion = await this.legionModel.findById(id).exec();
        if (!legion) {
            throw new NotFoundException(`Object with id ${id} not found`);
        }
        await this.planetModel.updateMany({ legions: legion._id }, { $pull: { legions: legion._id } })
        await this.legionModel.deleteOne({ _id: legion._id })
        await this.fileService.deleteFile(legion.icon)
        return { id: legion._id.toString() }
    }

    async deleteAll(): Promise<Array<{ id: string }>> {
        const legions = await this.legionModel.find().exec();
        await this.planetModel.updateMany({}, { $set: { legions: [] } })
        await this.legionModel.deleteMany({})
        await this.fileService.deleteFiles(legions.map((legion) => legion.icon))
        return legions.map((legion) => ({ id: legion._id.toString() }))
    }

    async update(id: string, dto: UpdateLegionDto, icon: Express.Multer.File | null): Promise<Legion> {
        const legion = await this.legionModel.findById(id);
        if (!legion) {
            throw new NotFoundException(`Legion with id ${id} not found`);
        }
        const oldIcon = legion.icon;
        const newIcon = icon ? await this.fileService.uploadFile(icon) : null;
        legion.name = dto.name ?? legion.name;
        legion.description = dto.description ?? legion.description;
        legion.icon = newIcon ?? oldIcon;
        try {
            await legion.save();
        } catch (error) {
            await this.fileService.deleteFile(newIcon)
            throw error
        }
        if (newIcon) {
            await this.fileService.deleteFile(oldIcon);
        }
        return legion;
    }
}
