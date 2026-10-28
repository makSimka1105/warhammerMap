import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Connection, Types } from 'mongoose';
import * as request from 'supertest';
import { PlanetService } from 'src/planets/planets.service';
import { EventService } from 'src/events/event.service';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { ObjectModule } from 'src/objects.module';
import { checkIntegrity } from 'src/scripts/db-check';

jest.mock('@nestjs/mapped-types', () => ({ PartialType: (type: unknown) => type }));

const MONGO_URL = `${process.env.MONGO_TEST_URL ?? 'mongodb://localhost:27017'}/warhammer_a_test`;
const PNG = Buffer.from('png-bytes');

describe('relations and images stay consistent', () => {
    let app: INestApplication;
    let connection: Connection;
    let planets: PlanetService;
    let events: EventService;
    const http = () => request(app.getHttpServer());

    const createLegion = async (name: string) =>
        (await http().post('/legions').field('name', name).attach('icon', PNG, { filename: 'i.png', contentType: 'image/png' }).expect(201)).body;
    const createPlanet = async (name: string, legions: Record<string, string> = {}) => {
        const req = http().post('/planets').field('name', name).field('size', 50).field('top', 10).field('left', 20);
        Object.entries(legions).forEach(([field, id]) => req.field(field, id));
        return (await req.attach('pic', PNG, { filename: 'p.png', contentType: 'image/png' }).expect(201)).body;
    };
    const updatePlanet = async (id: string, fields: Record<string, string>) => {
        const req = http().put(`/planets/${id}`);
        Object.entries(fields).forEach(([field, value]) => req.field(field, value));
        return (await req.expect(200)).body;
    };
    const issues = async () => Object.values(await checkIntegrity(connection)).flat();
    const countFiles = () => connection.db!.collection('images.files').countDocuments();
    const pipe = new ValidationPipe({ whitelist: true, transform: true });
    const updateEvent = async (id: string, body: object) =>
        JSON.parse(JSON.stringify(await events.update(id, await pipe.transform(body, { type: 'body', metatype: UpdateEventDto }))));

    beforeAll(async () => {
        const module = await Test.createTestingModule({ imports: [MongooseModule.forRoot(MONGO_URL), ObjectModule] }).compile();
        app = module.createNestApplication();
        await app.init();
        connection = module.get(getConnectionToken());
        planets = module.get(PlanetService);
        events = module.get(EventService);
    });

    beforeEach(async () => {
        await http().delete('/events');
        await http().delete('/planets');
        await http().delete('/legions');
    });

    afterAll(async () => {
        await app.close();
    });

    it('legion delete clears planets even when legion.planets is out of sync', async () => {
        const legion = await createLegion('Ultramarines');
        const planet = await createPlanet('Macragge', { legion1: legion._id });
        await connection.db!.collection('legions').updateMany({}, { $set: { planets: [] } });

        await http().delete(`/legions/${legion._id}`).expect(200);

        expect((await http().get(`/planets/${planet._id}`)).body.legions).toEqual([]);
        expect(await issues()).toEqual([]);
    });

    it('planet delete clears legions even when planet.legions is out of sync', async () => {
        const legion = await createLegion('Wolves');
        const planet = await createPlanet('Fenris', { legion1: legion._id });
        await connection.db!.collection('planets').updateMany({}, { $set: { legions: [] } });

        await http().delete(`/planets/${planet._id}`).expect(200);

        expect((await http().get(`/legions/${legion._id}`)).body.planets).toEqual([]);
    });

    it('the same legion as legion1 and legion2 is stored once', async () => {
        const legion = await createLegion('Angels');
        const created = await createPlanet('Baal', { legion1: legion._id, legion2: legion._id });
        expect(created.legions).toEqual([legion._id]);
        const updated = await updatePlanet(created._id, { legion1: legion._id, legion2: legion._id });
        expect(updated.legions).toEqual([legion._id]);
        expect((await http().get(`/legions/${legion._id}`)).body.planets).toHaveLength(1);
    });

    it('update treats legion1 and legion2 as independent slots', async () => {
        const first = await createLegion('First');
        const second = await createLegion('Second');
        const third = await createLegion('Third');
        const planet = await createPlanet('Terra', { legion1: first._id, legion2: second._id });

        expect((await updatePlanet(planet._id, { name: 'Terra' })).legions).toEqual([first._id, second._id]);
        expect((await updatePlanet(planet._id, { legion1: third._id })).legions).toEqual([third._id, second._id]);
        expect((await updatePlanet(planet._id, { legion2: '' })).legions).toEqual([third._id]);
        expect((await updatePlanet(planet._id, { legion1: '' })).legions).toEqual([]);
        expect(await issues()).toEqual([]);
    });

    it('rejects an unknown legion without touching the planet', async () => {
        const planet = await createPlanet('Terra');
        await http().put(`/planets/${planet._id}`).field('legion1', '0'.repeat(24)).expect(404);
        expect(await issues()).toEqual([]);
    });

    it('failed update removes the freshly uploaded pic', async () => {
        const planet = await createPlanet('Terra');
        const before = await countFiles();

        await expect(planets.updatePlanet(planet._id, { size: 'wide' as any }, { mimetype: 'image/png', buffer: PNG } as any)).rejects.toThrow();

        expect(await countFiles()).toBe(before);
        expect(await issues()).toEqual([]);
    });

    it('create, update and list return the same planet shape', async () => {
        const planet = await createPlanet('Terra');
        await http().post('/events').field('name', 'Landing').field('place', planet._id).expect(201);

        const updated = await updatePlanet(planet._id, { name: 'Holy Terra' });
        const listed = (await http().get('/planets')).body[0];

        expect(updated).toEqual(listed);
        expect(listed.events[0]).toMatchObject({ name: 'Landing', place: planet._id });
        expect(Object.keys(planet).sort()).toEqual(Object.keys(listed).sort());
    });

    it('partial event update keeps the fields that were not sent', async () => {
        const planet = await createPlanet('Fenris');
        const event = (await http().post('/events').field('name', 'Hunt').field('description', 'Old')
            .field('link', 'https://example.invalid/hunt').field('place', planet._id).expect(201)).body;

        const updated = await updateEvent(event._id, { name: 'Great Hunt' });

        expect(updated).toMatchObject({ name: 'Great Hunt', description: 'Old', link: 'https://example.invalid/hunt', place: planet._id });
        expect((await http().get(`/events/${event._id}`)).body).toEqual(updated);
    });

    it('updates an event and moves its planet relation', async () => {
        const first = await createPlanet('First');
        const second = await createPlanet('Second');
        const stale = await createPlanet('Stale');
        const event = (await http().post('/events').field('name', 'Landing').field('place', first._id)
            .attach('shots', PNG, { filename: 's.png', contentType: 'image/png' }).expect(201)).body;
        await connection.db!.collection('planets').updateOne({ name: 'Stale' }, { $set: { events: [new Types.ObjectId(event._id)] } });
        const files = await countFiles();

        const updated = await updateEvent(event._id, { description: 'Updated', place: second._id, shots: ['x.png'] });

        expect(updated).toMatchObject({ name: 'Landing', description: 'Updated', place: second._id });
        expect(updated.shots).toEqual(event.shots);
        expect(await countFiles()).toBe(files);
        expect((await http().get(`/planets/${first._id}`)).body.events).toEqual([]);
        expect((await http().get(`/planets/${stale._id}`)).body.events).toEqual([]);
        expect((await http().get(`/planets/${second._id}`)).body.events[0]._id).toBe(event._id);
        expect(await issues()).toEqual([]);
    });

    it('answers 404 when updating an unknown event or moving it to an unknown planet', async () => {
        const planet = await createPlanet('Terra');
        const event = (await http().post('/events').field('name', 'Siege').field('place', planet._id).expect(201)).body;
        const missing = '0123456789abcdef01234567';

        await http().put(`/events/${missing}`).send({ name: 'Ghost' }).expect(404);
        await http().put(`/events/${event._id}`).send({ place: missing }).expect(404);
        expect((await http().get(`/events/${event._id}`)).body).toMatchObject({ name: 'Siege', place: planet._id });
    });

    it('full lifecycle leaves no dangling refs or orphan files', async () => {
        const legion = await createLegion('Lions');
        const planet = await createPlanet('Caliban', { legion1: legion._id });
        const event = (await http().post('/events').field('name', 'Fall').field('place', planet._id)
            .attach('shots', PNG, { filename: 's.png', contentType: 'image/png' }).expect(201)).body;
        expect(event.place).toBe(planet._id);
        expect(await issues()).toEqual([]);

        await updatePlanet(planet._id, { legion1: '' });
        await http().delete(`/legions/${legion._id}`).expect(200);
        await http().delete(`/planets/${planet._id}`).expect(200);

        expect(await issues()).toEqual([]);
        expect(await countFiles()).toBe(0);
        expect((await http().get('/events')).body).toEqual([]);
    });

    it('bulk deletes empty the collections and files', async () => {
        const legion = await createLegion('Lions');
        const planet = await createPlanet('Caliban', { legion1: legion._id });
        await http().post('/events').field('name', 'Fall').field('place', planet._id)
            .attach('shots', PNG, { filename: 's.png', contentType: 'image/png' }).expect(201);

        await http().delete('/planets').expect(200);
        await http().delete('/legions').expect(200);

        expect(await issues()).toEqual([]);
        expect(await countFiles()).toBe(0);
    });
});
