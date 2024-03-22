import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { OauthService } from './oauth.service';
import { CreateOAuthProviderDto } from './dtos/create-oauth-provider.dto';

@Controller()
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('create_oauth_provider')
  async handleCreateOAuthProvider(
    @Payload()
    payload: CreateOAuthProviderDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.oauthService.createOAuthProvider(payload.provider, payload.userId);
    this.rmqService.ack(context);
  }
}
