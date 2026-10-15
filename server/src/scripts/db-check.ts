import { Connection, createConnection } from 'mongoose';
import { IMAGES_BUCKET } from '../files/file.service';

interface Doc {
    _id: { toString(): string };
    [field: string]: any;
}

const ids = (values: unknown): string[] => (Array.isArray(values) ? values.map(String) : []);

export async function checkIntegrity(connection: Connection): Promise<Record<string, string[]>> {
    const db = connection.db!;
    const load = (name: string) => db.collection<Doc>(name).find().toArray();
    const [planets, legions, events, files] = await Promise.all([
        load('planets'),
        load('legions'),
        load('events'),
        load(`${IMAGES_BUCKET}.files`),
    ]);
    const planetById = new Map(planets.map((planet) => [String(planet._id), planet]));
    const legionById = new Map(legions.map((legion) => [String(legion._id), legion]));
    const eventById = new Map(events.map((event) => [String(event._id), event]));
    const issues: Record<string, string[]> = {
        'planet -> missing legion': [],
        'legion -> missing planet': [],
        'planet lists legion, legion does not list planet': [],
        'legion lists planet, planet does not list legion': [],
        'planet -> missing event': [],
        'planet lists event, event.place is another planet': [],
        'event.place is not a single planet id': [],
        'event -> missing planet': [],
        'event.place planet does not list the event': [],
        'image referenced but missing in GridFS': [],
        'GridFS file referenced by nothing': [],
    };

    for (const planet of planets) {
        const planetId = String(planet._id);
        for (const legionId of ids(planet.legions)) {
            const legion = legionById.get(legionId);
            if (!legion) issues['planet -> missing legion'].push(`${planetId} -> ${legionId}`);
            else if (!ids(legion.planets).includes(planetId)) {
                issues['planet lists legion, legion does not list planet'].push(`${planetId} / ${legionId}`);
            }
        }
        for (const eventId of ids(planet.events)) {
            const event = eventById.get(eventId);
            if (!event) issues['planet -> missing event'].push(`${planetId} -> ${eventId}`);
            else if (String(event.place) !== planetId) {
                issues['planet lists event, event.place is another planet'].push(`${planetId} / ${eventId}`);
            }
        }
    }
    for (const legion of legions) {
        const legionId = String(legion._id);
        for (const planetId of ids(legion.planets)) {
            const planet = planetById.get(planetId);
            if (!planet) issues['legion -> missing planet'].push(`${legionId} -> ${planetId}`);
            else if (!ids(planet.legions).includes(legionId)) {
                issues['legion lists planet, planet does not list legion'].push(`${legionId} / ${planetId}`);
            }
        }
    }
    for (const event of events) {
        const eventId = String(event._id);
        if (Array.isArray(event.place) || !event.place) {
            issues['event.place is not a single planet id'].push(eventId);
            continue;
        }
        const planet = planetById.get(String(event.place));
        if (!planet) issues['event -> missing planet'].push(`${eventId} -> ${event.place}`);
        else if (!ids(planet.events).includes(eventId)) {
            issues['event.place planet does not list the event'].push(`${eventId} / ${event.place}`);
        }
    }

    const referenced = new Set<string>([
        ...planets.map((planet) => planet.pic),
        ...legions.map((legion) => legion.icon),
        ...events.flatMap((event) => ids(event.shots)),
    ].filter(Boolean));
    const stored = new Set(files.map((file) => String(file.filename)));
    for (const name of referenced) {
        if (!stored.has(name)) issues['image referenced but missing in GridFS'].push(name);
    }
    for (const name of stored) {
        if (!referenced.has(name)) issues['GridFS file referenced by nothing'].push(name);
    }
    return issues;
}

async function main() {
    const connection = await createConnection(process.env.MONGO_URL!).asPromise();
    const issues = await checkIntegrity(connection);
    await connection.close();
    let total = 0;
    for (const [title, items] of Object.entries(issues)) {
        total += items.length;
        console.log(`${items.length === 0 ? 'ok  ' : 'FAIL'} ${title}: ${items.length}`);
        items.slice(0, 10).forEach((item) => console.log(`       ${item}`));
    }
    console.log(total === 0 ? 'db:check passed, no issues' : `db:check found ${total} issue(s)`);
    process.exit(total === 0 ? 0 : 1);
}

if (require.main === module) {
    if (!process.env.MONGO_URL) {
        console.error('MONGO_URL is required');
        process.exit(1);
    }
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
