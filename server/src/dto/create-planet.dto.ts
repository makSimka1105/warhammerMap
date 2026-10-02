import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

const OPTIONAL_OBJECT_ID = /^([0-9a-f]{24})?$/i;

export class CreatePlanetDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @Type(() => Number)
    @IsNumber()
    readonly size: number;

    @Type(() => Number)
    @IsNumber()
    readonly top: number;

    @Type(() => Number)
    @IsNumber()
    readonly left: number;

    @IsOptional()
    @IsString()
    readonly ingamePosition?: string;

    @IsOptional()
    @Matches(OPTIONAL_OBJECT_ID, { message: 'legion1 must be an ObjectId' })
    readonly legion1?: string;

    @IsOptional()
    @Matches(OPTIONAL_OBJECT_ID, { message: 'legion2 must be an ObjectId' })
    readonly legion2?: string;

    @IsOptional()
    @IsString()
    readonly description?: string;
}

export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {}
