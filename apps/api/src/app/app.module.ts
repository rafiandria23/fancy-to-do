import { APP_PIPE, APP_GUARD, APP_FILTER } from '@nestjs/core';
import {
  Logger,
  Module,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { ExceptionFilter } from '@libs/api-common';
import { AuthGuard } from '@libs/api-auth';
import { ApiCommonModule } from '@libs/api-common';

import { apiConfig, dbConfig, jwtConfig } from './app.config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, dbConfig, jwtConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        dialectOptions: {
          ssl:
            configService.get<string>('db.ssl') === 'true'
              ? {
                  require: true,
                  rejectUnauthorized: true,
                }
              : undefined,
        },
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.pass'),
        database: configService.get<string>('db.name'),
        autoLoadModels: true,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          issuer: 'Fancy To Do',
        },
      }),
    }),
    ApiCommonModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory(data) {
            return new BadRequestException(data);
          },
          validationError: {
            target: false,
            value: false,
          },
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
  controllers: [AppController],
  exports: [AppService],
})
export class AppModule {}
