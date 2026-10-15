import { readFile } from 'fs/promises';
import { join } from 'path';
import { Connection, createConnection, Types } from 'mongoose';
import { Event, EventSchema } from '../events/event.schema';
import { FileService, IMAGES_BUCKET } from '../files/file.service';
import { Legion, LegionSchema } from '../legions/legion.schema';
import { Planet, PlanetSchema } from '../planets/planets.schema';

const IMAGES_DIR = join(__dirname, '..', '..', 'seed', 'images');
const SIGN_UP_ATTEMPTS = 30;
const SIGN_UP_DELAY_MS = 2000;

const LEGIONS = [
    { key: 'DA', name: 'Темные Ангелы', icon: 'dark_angels', description: 'Первый легион. Хранит тайну, которая старше самой Ереси.' },
    { key: 'SW', name: 'Космические Волки', icon: 'space_wolves', description: 'Шестой легион, свирепые охотники Фенриса, верные Всеотцу.' },
    { key: 'BA', name: 'Кровавые Ангелы', icon: 'blood_angels', description: 'Девятый легион, благородные воины, проклятые Красной Жаждой.' },
    { key: 'IH', name: 'Железные Руки', icon: 'iron_hands', description: 'Десятый легион. Плоть слаба, сталь чиста.' },
    { key: 'SAL', name: 'Саламандры', icon: 'salamanders', description: 'Восемнадцатый легион, кузнецы и защитники простых людей.' },
    { key: 'WB', name: 'Несущие Слово', icon: 'word_bearers', description: 'Семнадцатый легион, фанатики, променявшие Императора на богов Хаоса.' },
    { key: 'SOH', name: 'Сыны Хоруса', icon: 'sons_of_horus', description: 'Шестнадцатый легион, когда-то гордость Империума, теперь войско Магистра войны.' },
    { key: 'UM', name: 'Ультрамарины', icon: 'ultramarines', description: 'Тринадцатый легион, дисциплинированные защитники Ультрамара.' },
    { key: 'IF', name: 'Имперские Кулаки', icon: 'imperial_fists', description: 'Седьмой легион, мастера осады и стражи стен Императорского дворца.' },
];

const PLANETS = [
    { name: 'Луна', icon: 'moon', left: 790, top: 1250, size: 110, ingamePosition: 'Солар 07-12', description: 'Серый спутник Терры и хранилище архивов Механикум под охраной Имперских Кулаков.', legions: ['IF'] },
    { name: 'Калибан', icon: 'caliban', left: 150, top: 875, size: 126, ingamePosition: 'Пацификус 01-08', description: 'Лесной родной мир Темных Ангелов, расколотый после Ереси. Его обломки до сих пор кружат вокруг Скалы.', legions: ['DA'] },
    { name: 'Фенрис', icon: 'fenris', left: 250, top: 1125, size: 115, ingamePosition: 'Пацификус 02-11', description: 'Ледяной мир смерти, штормы и торосы. Здесь выросли Космические Волки.', legions: ['SW'] },
    { name: 'Ваал', icon: 'baal', left: 1938, top: 525, size: 119, ingamePosition: 'Обскурус 19-05', description: 'Пустынный родной мир Кровавых Ангелов под светом Красного Шрама.', legions: ['BA'] },
    { name: 'Медуза', icon: 'medusa', left: 1375, top: 2062, size: 108, ingamePosition: 'Ультима 13-20', description: 'Вулканический мир огня и землетрясений, закаливший Железных Рук.', legions: ['IH'] },
    { name: 'Ноктюрн', icon: 'nocturn', left: 500, top: 2025, size: 112, ingamePosition: 'Темпестус 05-20', description: 'Мир лавовых морей и черных гор, родина Саламандр.', legions: ['SAL'] },
    { name: 'Колхида', icon: 'colchis', left: 875, top: 2125, size: 104, ingamePosition: 'Ультима 08-21', description: 'Родина Лоргара и Несущих Слово, мир храмов и фанатиков.', legions: ['WB'] },
    { name: 'Хтония', icon: 'chtonia', left: 1688, top: 2050, size: 101, ingamePosition: 'Ультима 16-20', description: 'Шахтерский мир Сынов Хоруса, затерянный в тени Ока Ужаса.', legions: ['SOH'] },
    { name: 'Улланор Прайм', icon: 'ullanor_prime', left: 2125, top: 1375, size: 144, ingamePosition: 'Ультима 21-13', description: 'Место величайшего триумфа над орками, где Император нарек Хоруса Магистром войны.', legions: ['IF', 'DA'] },
    { name: 'Махария', icon: 'macharia', left: 1562, top: 375, size: 115, ingamePosition: 'Обскурус 15-03', description: 'Жемчужина Ультрамара, отвоеванная в Махарийском крестовом походе.', legions: ['UM', 'WB'] },
    { name: 'Кемос', icon: 'kemos', left: 2250, top: 750, size: 90, ingamePosition: 'Обскурус 22-07', description: 'Тихий мир-кузница на границе земель, где вербуют Кровавых Ангелов.', legions: ['BA', 'UM'] },
    { name: 'Хель', icon: 'hel', left: 438, top: 1250, size: 83, ingamePosition: 'Пацификус 04-12', description: 'Ледяная луна, где охотники Фенриса учатся выживать под бледным солнцем.', legions: ['SW'] },
    { name: 'Сикарус', icon: 'sicarus', left: 1250, top: 312, size: 86, ingamePosition: 'Обскурус 12-03', description: 'Мир-гарнизон, стерегущий торговые пути к Ультрамару.', legions: ['UM'] },
    { name: 'Калдерис', icon: 'kalderis', left: 1625, top: 650, size: 94, ingamePosition: 'Обскурус 16-06', description: 'Мир-улей, который не раз переходил из рук лоялистов к флотам предателей.', legions: ['DA', 'SOH'] },
    { name: 'Ризмунд', icon: 'risemund', left: 2312, top: 1188, size: 79, ingamePosition: 'Ультима 23-11', description: 'Мир-крепость Имперских Кулаков в кольце орбитальных бастионов.', legions: ['IF'] },
    { name: 'Отсо', icon: 'otso', left: 750, top: 1875, size: 76, ingamePosition: 'Темпестус 07-18', description: 'Заснеженная луна системы Фенриса, которую патрулируют крейсеры Темных Ангелов.', legions: ['SW', 'DA'] },
    { name: 'Минтория', icon: 'mintoria', left: 1250, top: 1875, size: 97, ingamePosition: 'Ультима 12-18', description: 'Индустриальный мир, где Железные Руки и Саламандры делят кузницы.', legions: ['IH', 'SAL'] },
    { name: 'Нейтра', icon: 'neitra', left: 250, top: 1625, size: 72, ingamePosition: 'Темпестус 02-16', description: 'Шахтерская колония, чьи холодные штольни снабжают рудой Железных Рук.', legions: ['IH'] },
    { name: 'Вармал', icon: 'varmal', left: 162, top: 1875, size: 81, ingamePosition: 'Темпестус 01-18', description: 'Пограничный мир, где культы Несущих Слово сходятся с бандами Сынов Хоруса.', legions: ['WB', 'SOH'] },
    { name: 'Гамаун', icon: 'gamaun', left: 1812, top: 1812, size: 90, ingamePosition: 'Ультима 18-18', description: 'Выжженная луна-кузница, поставляющая броню Саламандр Имперским Кулакам.', legions: ['SAL', 'IF'] },
    { name: 'Пальмирия', icon: 'palmiria', left: 2125, top: 2125, size: 86, ingamePosition: 'Ультима 21-21', description: 'Цветущий аграрный мир, редкая гавань мира между Ультрамаринами и Кровавыми Ангелами.', legions: ['UM', 'BA'] },
];

const EVENTS = [
    { planet: 'Калибан', name: 'Падение Калибана', description: 'Родной мир Льва Эль-Джонсона раскалывается в междоусобной войне после Ереси.', shots: ['eye_of_terror'] },
    { planet: 'Хтония', name: 'Знамя Хоруса', description: 'Сыны Хоруса собираются на родном мире перед походом на Терру.', shots: ['vengeful_spirit', 'red_tear'] },
    { planet: 'Ваал', name: 'Кровавый туман', description: 'Рой обрушивается на Ваал, и Кровавые Ангелы держат оборону тысячу дней.', shots: ['blood_mist'] },
    { planet: 'Улланор Прайм', name: 'Триумф Улланора', description: 'Орки Улланора разбиты, Великий крестовый поход празднует лучшую победу.', shots: ['magellan'] },
    { planet: 'Махария', name: 'Махарийский поход', description: 'Ультрамарины ведут крестовый поход и возвращают Императору десятки миров.', shots: ['malstream', 'vengeful_spirit'] },
    { planet: 'Фенрис', name: 'Великая охота', description: 'Волки Фенриса прочесывают ледяные поля в охоте, которая испытывает каждого Кровавого Когтя.', shots: ['red_tear'] },
    { planet: 'Колхида', name: 'Зов Лоргара', description: 'В великом храме Колхиды Несущие Слово впервые отвечают на шепот варпа.', shots: ['blood_mist', 'malstream'] },
];

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readImage = (folder: string, name: string) => readFile(join(IMAGES_DIR, folder, `${name}.png`));

async function wipe(connection: Connection) {
    const db = connection.db!;
    await Promise.all(['planets', 'legions', 'events', `${IMAGES_BUCKET}.files`, `${IMAGES_BUCKET}.chunks`].map(
        (collection) => db.collection(collection).deleteMany({}),
    ));
}

async function store(files: FileService, folder: string, name: string) {
    return files.uploadFile({ mimetype: 'image/png', buffer: await readImage(folder, name) });
}

async function seedMap(connection: Connection) {
    const files = new FileService(connection);
    const legionModel = connection.model(Legion.name, LegionSchema);
    const planetModel = connection.model(Planet.name, PlanetSchema);
    const eventModel = connection.model(Event.name, EventSchema);

    const legions = await Promise.all(LEGIONS.map(async (legion) => ({
        ...legion,
        _id: new Types.ObjectId(),
        icon: await store(files, 'legions', legion.icon),
        planets: [] as Types.ObjectId[],
    })));
    const planets = await Promise.all(PLANETS.map(async (planet) => ({
        ...planet,
        _id: new Types.ObjectId(),
        pic: await store(files, 'planets', planet.icon),
        legions: planet.legions.map((key) => legions.find((legion) => legion.key === key)!._id),
        events: [] as Types.ObjectId[],
    })));
    for (const planet of planets) {
        for (const legionId of planet.legions) {
            legions.find((legion) => legion._id.equals(legionId))!.planets.push(planet._id);
        }
    }
    const events = await Promise.all(EVENTS.map(async (event) => {
        const place = planets.find((planet) => planet.name === event.planet)!;
        const created = {
            _id: new Types.ObjectId(),
            name: event.name,
            description: event.description,
            place: place._id,
            shots: await Promise.all(event.shots.map((shot) => store(files, 'shots', shot))),
        };
        place.events.push(created._id);
        return created;
    }));

    await legionModel.insertMany(legions);
    await planetModel.insertMany(planets);
    await eventModel.insertMany(events);
    console.log(`seeded ${planets.length} planets, ${legions.length} legions, ${events.length} events`);
}

async function signUp(url: string, email: string, password: string): Promise<'done' | 'retry' | 'rejected'> {
    try {
        const response = await fetch(`${url}/api/auth/sign-up/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: url },
            body: JSON.stringify({ email, password, name: 'Admin' }),
        });
        if (response.ok) return 'done';
        const body = await response.text();
        if (/already exists/i.test(body)) return 'done';
        return response.status >= 500 ? 'retry' : 'rejected';
    } catch {
        return 'retry';
    }
}

async function createAdmin() {
    const url = process.env.FRONT_URL?.replace(/\/$/, '');
    if (!url) {
        console.log('FRONT_URL is not set, skipping admin sign-up');
        return;
    }
    const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@warhammer.local';
    const password = process.env.SEED_ADMIN_PASSWORD ?? 'warhammer40k';
    for (let attempt = 1; attempt <= SIGN_UP_ATTEMPTS; attempt++) {
        const outcome = await signUp(url, email, password);
        if (outcome === 'done') {
            console.log(`admin ${email} is ready`);
            return;
        }
        if (outcome === 'rejected') break;
        await pause(SIGN_UP_DELAY_MS);
    }
    console.warn(`warning: could not sign up ${email} at ${url}`);
}

async function main() {
    const connection = await createConnection(process.env.MONGO_URL!).asPromise();
    const existing = await connection.db!.collection('planets').countDocuments();
    if (existing > 0 && !process.argv.includes('--reset')) {
        console.log(`database already has ${existing} planets, pass --reset to wipe it and seed again`);
    } else {
        await wipe(connection);
        await seedMap(connection);
    }
    await connection.close();
    await createAdmin();
}

if (!process.env.MONGO_URL) {
    console.error('MONGO_URL is required');
    process.exit(1);
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
