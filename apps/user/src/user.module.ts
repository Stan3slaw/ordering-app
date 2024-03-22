import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

import { RmqModule } from '@app/common';

import { KnexModule } from '@app/common/database/knex/knex.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OAUTH_SERVICE } from './constants/services.constants';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_OAUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/notification/.env',
    }),
    RmqModule.register({ name: OAUTH_SERVICE }),
    KnexModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
