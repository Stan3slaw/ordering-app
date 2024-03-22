import { Injectable } from '@nestjs/common';

import type { Knex } from 'knex';

import { KnexService } from '@app/common';

import type { OAuthProviderEntity } from './entities/oauth-provider.entity';
import type { CreateOAuthProvider } from './interfaces/create-oauth-provider.interface';

@Injectable()
export class OAuthProviderRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(
    createOAuthProvider: CreateOAuthProvider,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<OAuthProviderEntity> {
    const knex = trx ?? this.knexService.getKnex();
    const [createdOAuthProvider] = await knex('oauth_providers')
      .insert(createOAuthProvider)
      .returning('*');

    return createdOAuthProvider;
  }
}
