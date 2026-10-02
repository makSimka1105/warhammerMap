import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './main-app.module';

async function start() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({
        origin: config.getOrThrow<string>('FRONT_URL'),
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    const port = config.get<number>('PORT') ?? 5000;
    await app.listen(port);
    console.log(`server was started on ${port}`);
}

start().catch((error) => {
    console.error(error);
    process.exit(1);
});
