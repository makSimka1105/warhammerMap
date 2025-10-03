import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Legion, LegionDocument } from "./legion.schema";
import { CreateLegionDto } from "src/dto/create-legion.dto";
import { handleInvalidIdError, handleObjNotFound, handleGeneralServerError } from "src/error-holder";
import { FileService } from "src/files/file.service";
import { Planet, PlanetDocument } from "src/planets/planets.schema";


@Injectable()
export class LegionService {
    constructor(@InjectModel(Legion.name) private legionModel: Model<LegionDocument>,
        @InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
        private fileService: FileService,
        // private planetService: PlanetService,
    ) { }

    async create(dto: CreateLegionDto, icon): Promise<Legion> {
        const legionIconPath = await this.fileService.uploadFile(icon, 'legions', dto.name);


        const legion = await this.legionModel.create({
            ...dto,
            planets: [],
            icon: legionIconPath
        })

        return legion
    }

    async getAll(): Promise<Legion[]> {
        const legions = await this.legionModel.find().exec();
        return legions
    }

    async getOne(id: ObjectId | string): Promise<Legion | null> {
        handleInvalidIdError(id)
        try {
            const legion = await this.legionModel.findById(id).populate('objects').populate('planets').exec();
            handleObjNotFound(legion, id)
            return legion
        } catch (error) {
            handleGeneralServerError(error)
        }
    }

    async delete(id: ObjectId | string): Promise<{ id: string | null, icon: string | void }> {
        handleInvalidIdError(id)
        try {
            const deleted = await this.legionModel.findByIdAndDelete(id).exec();
            if (!deleted) {
                handleObjNotFound(deleted, id);
                return { id: null, icon: '' }; // Если объект не найден, возвращаем null
            }

            const deletedFile = await this.fileService.deleteFile(deleted.icon)
             await Promise.all(deleted.planets.map(async link => {

                await this.planetModel.findByIdAndUpdate(link, { $pull: { 'legions': id } },
                    { new: true, runValidators: true })
            }))
            return { id: deleted._id.toString(), icon: deletedFile }
        } catch (error) {
            handleGeneralServerError(error)
        }
    }
    async deletePlanet(id: any , objectId: ObjectId|string ): Promise<{ id: string | null }> {
        handleInvalidIdError(id);
        handleInvalidIdError(objectId);
        // if  (typeof id === 'string'){
        //     return { id: id }
        // }


        try {
            const update = { $pull: { 'planets': objectId } }; // Используем $pull для удаления элемента из массива
            const updatedLegion = await this.legionModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
            console.log(updatedLegion)
            handleObjNotFound(updatedLegion, id);
            return { id: updatedLegion ? updatedLegion._id.toString() : null };
        } catch (error) {
            handleGeneralServerError(error);
        }
    }




    async deleteAll(): Promise<Array<{ id: string | null }>> {
        try {
            const legions = await this.legionModel.find().exec();
            const deletedIds = await Promise.all(legions.map(async (legion) => {
                if (!legion._id) {
                    handleInvalidIdError(legion._id);
                    return { id: null };
                }
                return await this.delete(legion.id);
            }))
            return deletedIds;
        } catch (error) {
            handleGeneralServerError(error)
        }
    }


    async update(id: string, dto: Partial<CreateLegionDto>, icon: Express.Multer.File | null): Promise<Legion | null> {
        handleInvalidIdError(id);
        try {

            const legion = await this.legionModel.findById(id);
            if (!legion) {
                throw new Error(`Legion with id ${id} not found`);
            }

            if (icon && legion.icon) {
                await this.fileService.deleteFile(legion.icon);
            }

            // Загрузить новую иконку, если она есть, иначе оставить старую
            const iconPath = icon ? await this.fileService.uploadFile(icon, 'legions', dto.name||legion.name) : legion.icon;



            const updatedLegion = await this.legionModel.findByIdAndUpdate(
                id,
                {

                    $set: {
                        'name': dto.name,
                        'description': dto.description,
                        'icon': iconPath,
                    }
                }
                , { new: true, runValidators: true }
            )
            handleObjNotFound(updatedLegion, id)
            return updatedLegion;
        } catch (error) {
            handleGeneralServerError(error);
        }
    }


    // async addPlanet(id: ObjectId | string, dto:Partial<CreateLegionDto>): Promise<Legion | null>{
    //     handleInvalidIdError(id);
    //     try {
    //         const legion =await this.legionModel.findById(id).exec()
    //         handleObjNotFound(legion, id)
    //         const updatedLegion = await this.legionModel.findByIdAndUpdate(
    //             id,
    //             {

    //                 $push:{
    //                 'planets':dto.planets
    //                 },
    //             },
    //             { new: true, runValidators: true }
    //         )
    //         return updatedLegion
    //     } catch (error) {
    //         handleGeneralServerError(error)
    //     }
    // }


    // async deletePlanet(id: ObjectId | string, dto:Partial<CreateLegionDto>): Promise<Legion | null>{
    //     handleInvalidIdError(id);
    //     try {
    //         const legion =await this.legionModel.findById(id).exec()
    //         handleObjNotFound(legion, id)
    //         const updatedLegion = await this.legionModel.findByIdAndUpdate(
    //             id,
    //             {

    //                 $pull:{
    //                 'planets':dto.planets
    //                 },
    //             },
    //             { new: true, runValidators: true }
    //         )
    //         return updatedLegion
    //     } catch (error) {
    //         handleGeneralServerError(error)
    //     }
    // }



}