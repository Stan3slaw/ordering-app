import { Injectable } from '@nestjs/common';

import type { Knex } from 'knex';

import { KnexService } from '@app/common';

import type { CreateUser } from './interfaces/create-user.interface';
import type { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(
    createUser: CreateUser,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<UserEntity> {
    const knex = trx ?? this.knexService.getKnex();
    const [createdUser] = await knex('users').insert(createUser).returning('*');

    return createdUser;
  }

  async findOneByEmail(
    email: string,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<UserEntity> {
    const knex = trx ?? this.knexService.getKnex();
    const foundUser = await knex('users').first<UserEntity>().where({ email });

    return foundUser;
  }

  async findOneById(
    userId: number,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<UserEntity> {
    const knex: Knex = trx ?? this.knexService.getKnex();
    const foundUser = await knex('users')
      .first<UserEntity>()
      .where({ id: userId });

    return foundUser;
  }
}
