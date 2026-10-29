import { EventService } from './event.service';

const event = (id: string, createdAt: string, place: string) => ({
    _id: id,
    name: id,
    shots: [],
    place,
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
});

function serviceWith(count: number, events: unknown[], planets: unknown[]) {
    const sort = jest.fn(() => ({ lean: () => ({ exec: async () => events }) }));
    const eventModel = {
        countDocuments: () => ({ exec: async () => count }),
        find: jest.fn(() => ({ sort })),
    };
    const planetModel = { find: jest.fn(() => ({ lean: () => ({ exec: async () => planets }) })) };
    return { service: new EventService(eventModel as any, planetModel as any, {} as any), eventModel, sort };
}

describe('event export', () => {
    it('sorts by createdAt and id and maps a missing planet to null', async () => {
        const planet = { _id: 'p1', name: 'Terra', size: 1, top: 2, left: 3, pic: 'p.png' };
        const { service, sort } = serviceWith(2, [event('a', '2026-01-01', 'p1'), event('b', '2026-01-02', 'gone')], [planet]);

        const exported = await service.exportAll();

        expect(sort).toHaveBeenCalledWith({ createdAt: 1, _id: 1 });
        expect(exported.events).toEqual([
            expect.objectContaining({
                id: 'a',
                description: null,
                link: null,
                shots: [],
                place: { id: 'p1', name: 'Terra', size: 1, top: 2, left: 3, ingamePosition: null, pic: 'p.png', description: null },
                createdAt: '2026-01-01T00:00:00.000Z',
            }),
            expect.objectContaining({ id: 'b', place: null }),
        ]);
    });

    it('exports an empty list', async () => {
        const { service } = serviceWith(0, [], []);
        await expect(service.exportAll()).resolves.toMatchObject({ events: [] });
    });

    it('rejects more than 10000 events before loading them', async () => {
        const { service, eventModel } = serviceWith(10001, [], []);
        await expect(service.exportAll()).rejects.toMatchObject({ status: 413 });
        expect(eventModel.find).not.toHaveBeenCalled();
    });
});
