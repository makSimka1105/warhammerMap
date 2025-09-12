import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ObjectModule } from './objects.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './files/file.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '', 'static'),
      serveRoot: '/static/',
    }),

    MongooseModule.forRoot(process.env.MONGO_LINK || '', {}),
    ObjectModule,
    FileModule,
  ],
  exports: [ObjectModule, FileModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store'); // Отключить кэширование
        next();
      })
      .forRoutes('*'); // Применить ко всем маршрутам
  }
}