import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ApiCommonModule } from '@libs/api-common';

import { UserModule } from '../user/user.module';

import { UserPassword } from './models/user-password.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([UserPassword]),
    ApiCommonModule,
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
