import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import KnexInit from 'knex';

import { Logger } from '../logger/logger.service';

@Injectable()
export class KnexService {
  constructor(
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(KnexService.name);
  }

  public knex: Knex;

  transaction = <T>(
    trx: (trx: Knex.Transaction) => Promise<T> | void,
  ): Promise<T> => this.knex.transaction(trx);

  onApplicationBootstrap = (): void => {
    try {
      this.logger.log('Setting up Knex client for DB connection...');
      this.knex = KnexInit({
        client: this.configService.get<string>('DB_CLIENT'),
        connection: {
          host: this.configService.get<string>('DB_HOST'),
          user: this.configService.get<string>('DB_USER'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_DATABASE'),
          port: Number(this.configService.get<string>('DB_PORT')),
        },
        debug: true,
      });
      this.logger.log('Successfully created Knex connection to DB');
    } catch (err) {
      this.logger.error('Failed to get connection using Knex', err);
    }
  };
}
