/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import KnexInit from 'knex';

import { Logger } from '../../logger/logger.service';
import knexConfiguration from './knex.configuration';

@Injectable()
export class KnexService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(KnexService.name);
  }

  private knex: Knex;

  public transaction = <T>(
    trx: (trx: Knex.Transaction) => Promise<T> | void,
  ): Promise<T> => this.knex.transaction(trx);

  public getKnex(): Knex<any, any[]> {
    if (!this.knex) {
      try {
        this.logger.log('Setting up Knex client for DB connection...');
        this.knex = KnexInit(knexConfiguration);
        this.logger.log('Successfully created Knex connection to DB');
      } catch (err) {
        this.logger.error('Failed to get connection using Knex', err);
      }
    }

    return this.knex;
  }
}
