import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdateEventDto } from './update-event.dto';

describe('UpdateEventDto', () => {
    const pipe = new ValidationPipe({ whitelist: true, transform: true });
    const validate = (body: object) => pipe.transform(body, { type: 'body', metatype: UpdateEventDto });

    it('accepts a partial body and strips shots', async () => {
        const dto = await validate({ name: 'Battle', shots: ['x.png'] });
        expect(dto).toEqual({ name: 'Battle' });
    });

    it.each([
        { name: '' },
        { name: null },
        { place: null },
        { place: 'not-an-id' },
        { link: 5 },
    ])('rejects %j with 400', async (body) => {
        await expect(validate(body)).rejects.toBeInstanceOf(BadRequestException);
    });
});
