export class CreatePlanetDto{
    readonly name :string;
    readonly type:'planet'|'ship'|'anomaly';

    readonly size: number;
    readonly top : number;
    readonly left : number;
    readonly ingamePosition : string;
    readonly pic : File;
    readonly legion1 : string;
    readonly legion2 : string;

    readonly description : string;
    

}