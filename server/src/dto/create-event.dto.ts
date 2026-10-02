import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsOptional()
    @IsString()
    readonly link?: string;

    @IsMongoId()
    readonly place: string;
}
