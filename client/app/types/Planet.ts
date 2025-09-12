import { IEvent } from "./event";

export interface IPlanet {
            _id: string;
            name: string;
            type:'planet'|'ship'|'anomaly';
            ingamePosition?: string;
            left: number;
            top: number;
            size: number;
            pic: string; 
            legions?:string[],
            description?: string;
            events?:IEvent[]
            
}
