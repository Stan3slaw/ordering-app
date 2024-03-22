import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { hash } from 'bcryptjs';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import { OAuthProviders } from '@app/common/enums/oauth-providers.enum';

import type { CreateUser } from './interfaces/create-user.interface';
import type { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { OAUTH_SERVICE } from './constants/services.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(OAUTH_SERVICE)
    private readonly oauthClient: ClientProxy,
  ) {}

  private static async createUserEntity(
    email: string,
    name: string,
    password: string,
    isConfirmed: boolean,
  ): Promise<CreateUser> {
    return {
      email,
      name,
      password: isNil(password) ? 'UNSET' : await hash(password, 10),
      confirmed: isConfirmed,
      credentials: {
        version: isConfirmed ? 1 : 0,
        lastPassword: '',
        passwordUpdatedAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  public async create(
    provider: OAuthProviders,
    email: string,
    name: string,
    password?: string,
  ): Promise<UserEntity> {
    const isConfirmed = provider !== OAuthProviders.LOCAL;
    const formattedEmail = email.toLowerCase();

    const foundUser = await this.userRepository.findOneByEmail(formattedEmail);

    if (foundUser) {
      throw new RpcException(new ConflictException('Email already in use'));
    }

    const createdUser = await this.userRepository.create(
      await UserService.createUserEntity(
        formattedEmail,
        name,
        password,
        isConfirmed,
      ),
    );

    await this.oauthClient.emit('create_oauth_provider', {
      provider,
      userId: createdUser.id,
    });

    return createdUser;
  }
}
