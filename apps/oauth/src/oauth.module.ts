import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

import { KnexModule, RmqModule } from '@app/common';

import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { OAuthProviderRepository } from './oauth-provider.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_OAUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/notification/.env',
    }),
    RmqModule,
    KnexModule,
  ],
  controllers: [OauthController],
  providers: [OauthService, OAuthProviderRepository],
})
export class OauthModule {}
