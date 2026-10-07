import { EventService } from 'src/events/event.service';
import { LegionService } from 'src/legions/legion.service';
import { PlanetService } from 'src/planets/planets.service';

const PNG = { mimetype: 'image/png', buffer: Buffer.from('png-bytes') } as Express.Multer.File;
const INSERT_ERROR = new Error('insert failed');

function fileServiceMock() {
    return {
        uploadFile: jest.fn().mockResolvedValue('a'.repeat(24) + '.png'),
        uploadFiles: jest.fn().mockResolvedValue(['b'.repeat(24) + '.png', 'c'.repeat(24) + '.png']),
        deleteFile: jest.fn().mockResolvedValue(undefined),
        deleteFiles: jest.fn().mockResolvedValue(undefined),
    };
}

describe('create removes uploaded files when the document insert fails', () => {
    it('legion: deletes the icon and rethrows the insert error', async () => {
        const files = fileServiceMock();
        const legionModel = { create: jest.fn().mockRejectedValue(INSERT_ERROR) };
        const service = new LegionService(legionModel as any, {} as any, files as any);

        await expect(service.create({ name: 'Ultramarines' } as any, PNG)).rejects.toBe(INSERT_ERROR);

        expect(files.deleteFile).toHaveBeenCalledWith('a'.repeat(24) + '.png');
    });

    it('planet: deletes the pic and rethrows the insert error', async () => {
        const files = fileServiceMock();
        const planetModel = { create: jest.fn().mockRejectedValue(INSERT_ERROR) };
        const service = new PlanetService(planetModel as any, {} as any, {} as any, {} as any, files as any);

        await expect(service.create({ name: 'Macragge' } as any, PNG)).rejects.toBe(INSERT_ERROR);

        expect(files.deleteFile).toHaveBeenCalledWith('a'.repeat(24) + '.png');
    });

    it('event: deletes every shot and rethrows the insert error', async () => {
        const files = fileServiceMock();
        const planetModel = { findById: jest.fn().mockResolvedValue({ _id: 'p1' }) };
        const eventModel = { create: jest.fn().mockRejectedValue(INSERT_ERROR) };
        const service = new EventService(eventModel as any, planetModel as any, files as any);

        await expect(service.create({ place: 'p1' } as any, [PNG, PNG])).rejects.toBe(INSERT_ERROR);

        expect(files.deleteFiles).toHaveBeenCalledWith(['b'.repeat(24) + '.png', 'c'.repeat(24) + '.png']);
    });
});
