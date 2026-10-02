import { BadRequestException, PipeTransform } from '@nestjs/common';

const OBJECT_ID = /^[0-9a-f]{24}$/i;

export class ParseObjectIdPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        if (!OBJECT_ID.test(value)) {
            throw new BadRequestException(`Invalid id format: ${value}`);
        }
        return value;
    }
}
