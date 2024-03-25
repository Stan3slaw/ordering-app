import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { hash } from 'bcryptjs';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import { isEmail } from 'class-validator';

import { OAuthProviders } from '@app/common/enums/oauth-providers.enum';

import type { CreateUser } from './interfaces/create-user.interface';
import type { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { OAUTH_SERVICE } from './constants/services.constants';
import type { UserResponseDto } from './dtos/user-response.dto';

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

  private static async mapUserEntityToUserResponseDto(
    userEntity: UserEntity,
  ): Promise<UserResponseDto> {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      confirmed: userEntity.confirmed,
      credentials: userEntity.credentials,
      createdAt: userEntity.created_at,
      updatedAt: userEntity.updated_at,
    };
  }

  async create(
    provider: OAuthProviders,
    email: string,
    name: string,
    password?: string,
  ): Promise<UserResponseDto> {
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

    const mappedUserToUserResponseDto =
      UserService.mapUserEntityToUserResponseDto(createdUser);

    return mappedUserToUserResponseDto;
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    if (!isEmail(email)) {
      throw new RpcException(new BadRequestException('invalid email'));
    }

    const foundUser = await this.userRepository.findOneByEmail(email);

    if (!foundUser) {
      throw new RpcException(new BadRequestException('there are no such user'));
    }

    const mappedUserToUserResponseDto =
      UserService.mapUserEntityToUserResponseDto(foundUser);

    return mappedUserToUserResponseDto;
  }
}
