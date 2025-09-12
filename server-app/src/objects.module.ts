import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LegionController } from "./legions/legion.controller";
import { LegionService } from "./legions/legion.service";
import { Legion, LegionSchema } from "./legions/legion.schema";

// import { OthersController } from "./other-objects/others.controller";
// import { OthersService } from "./other-objects/others.service";
// import { OtherSchema ,Other} from "./other-objects/others.schema";

import { PlanetController } from "./planets/planets.controller";
import { PlanetService } from "src/planets/planets.service";
import { PlanetSchema ,Planet} from "./planets/planets.schema";


import { FileService } from "./files/file.service";
import { EventController } from "./events/event.controller";
import { EventSchema } from "./events/event.schema";
import { EventService } from "./events/event.service";


@Module({
    imports:[
        MongooseModule.forFeature([
            // {name: Other.name,schema: OtherSchema},
            {name: Planet.name,schema: PlanetSchema},
            {name: Legion.name,schema: LegionSchema},
            {name: Event.name,schema: EventSchema},

        ])
       
        
    ],
    controllers: [
        PlanetController,
        LegionController,
        EventController,

    ],
    providers: [
        PlanetService,
        LegionService,
        EventService,
        FileService
    ],
    

})
export class ObjectModule{}