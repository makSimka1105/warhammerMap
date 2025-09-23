import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Planet, PlanetDocument } from "./planets.schema";
import { CreatePlanetDto } from "src/dto/create-planet.dto";
import { handleInvalidIdError, handleObjNotFound, handleGeneralServerError, handleGroupsNotValid} from "src/error-holder";
import { Legion,LegionDocument } from "src/legions/legion.schema";
import { LegionService } from "src/legions/legion.service";
import { FileService } from "src/files/file.service";
import { EventDocument } from "src/events/event.schema";


@Injectable()
export class PlanetService{
    constructor(@InjectModel(Planet.name) private planetModel: Model<PlanetDocument>,
    @InjectModel(Legion.name) private legionModel: Model<LegionDocument> ,
    @InjectModel(Event.name) private eventModel: Model<EventDocument> ,
    private legionService: LegionService,
        private fileService: FileService,
        
    ) {}
    async create( dto: CreatePlanetDto,pic):Promise<Planet>{

        let{  legion1,legion2 , ...planetData } = dto;
        console.log(legion1,legion2)

        let legions:string[]=[]
        if(legion1!==null && legion1!==undefined){legions.push(legion1)}
        if(legion2!==null && legion2!==undefined){legions.push(legion2)}
        // console.log(legions)
        const legionSelfs=await Promise.all(legions.map(async link =>{
            const founded=await this.legionModel.findById(link)
            if (founded==null)throw Error(`${link} not found`)
            return founded
        }))

        const legionsIds = legionSelfs.map(g=>{
            if(g){
                return g._id
            }
        })
        const picPath = await this.fileService.uploadFile( pic,'icons',dto.name);
        const createdPlanet = await this.planetModel.create({
            ...planetData,
            pic: picPath,
            legions: legionsIds,
            
        });
        await Promise.all(legionSelfs.map(async legion =>{
            
            legion.planets.push(createdPlanet._id);
            await legion.save();

        }))

       
        
        return createdPlanet;
    }


    async getAll(): Promise<Planet[]> {
        const planets = await this.planetModel.find().populate('events').exec();
        return planets
    }

    async getOne(id:ObjectId ) :Promise<Planet|null>{
        handleInvalidIdError(id)
        try {
            const planet = await this.planetModel.findById(id).populate(['legions','events']).exec()
            handleObjNotFound(planet,id)
            return planet
        } catch (error) {
            handleGeneralServerError(error)
        }
    }

    async delete(id: ObjectId | string): Promise<{ id: string | null }> {
        
        try {
            // First find the planet to get its groups
            handleInvalidIdError(id);
        const planet = await this.planetModel.findById(id).exec();
        if (!planet) {
            handleObjNotFound(null, id);
            return { id: null };
        }
        // Delete all references to this planet in groups
        const legions=planet.legions
        if (legions){
                await Promise.all(legions.map(async (groupId) => {

                       handleInvalidIdError(id) 
                    await this.legionService.deletePlanet(groupId, id);
            }));
            }
        // Delete the planet's file if it exists
        if (planet.pic) {
            await this.fileService.deleteFile(planet.pic);
        }
        if(planet.events){
            await Promise.all(planet.events.map(async link=>{
                await this.eventModel.findByIdAndDelete(link)
            }))
        }
        // Finally delete the planet itself
        await this.planetModel.findByIdAndDelete(id).exec();
        return { id: planet._id.toString() };
    } catch (error) {
        handleGeneralServerError(error);
    }
    }

    async deleteAll(): Promise<Array<{id: string | null}>> {
        try {
            const planets = await this.planetModel.find().exec();
            const deletedIds = await Promise.all(planets.map(async (planet) => {
                if (!planet._id){
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
    

    
    async deleteLegion(id: ObjectId | string, legion:ObjectId|string): Promise<Planet | null> {
        handleInvalidIdError(id);
        try {
            const updatedPlanet = await this.planetModel.findByIdAndUpdate(
                id,
                { $pull:{'legions':legion}  },
                { new: true, runValidators: true })
            handleObjNotFound(updatedPlanet,id)
            return updatedPlanet;
        }catch (error) {
            handleGeneralServerError(error);
        }
    }
}


