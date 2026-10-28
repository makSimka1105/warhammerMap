import { IsMongoId, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

const isSent = (_: object, value: unknown) => value !== undefined;

export class UpdateEventDto {
    @ValidateIf(isSent)
    @IsString()
    @IsNotEmpty()
    readonly name?: string;

    @ValidateIf(isSent)
    @IsString()
    readonly description?: string;

    @ValidateIf(isSent)
    @IsString()
    readonly link?: string;

    @ValidateIf(isSent)
    @IsMongoId()
    readonly place?: string;
}
