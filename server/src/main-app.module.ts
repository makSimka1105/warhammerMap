import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminGuard } from './auth/admin.guard';
import { ObjectModule } from './objects.module';

const REQUIRED_ENV = ['MONGO_URL', 'FRONT_URL'];

function validateEnv(env: Record<string, unknown>) {
    const missing = REQUIRED_ENV.filter((key) => !env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    return env;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URL'),
        serverSelectionTimeoutMS: 5000,
      }),
    }),
    ObjectModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AdminGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store');
        next();
      })
      .exclude({ path: 'files/:name', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
