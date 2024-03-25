import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.interface';
import type { UserResponseDto } from './dtos/user-response.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('create_user')
  async handleCreateUser(
    @Payload()
    payload: CreateUserDto,
    @Ctx() context: RmqContext,
  ): Promise<UserResponseDto> {
    const createdUser = await this.userService.create(
      payload.provider,
      payload.email,
      payload.name,
      payload.password,
    );
    await this.rmqService.ack(context);

    return createdUser;
  }

  @EventPattern('find_user_by_email')
  async handleFindUserByEmail(
    @Payload('email')
    email: string,
    @Ctx() context: RmqContext,
  ): Promise<UserResponseDto> {
    const foundUser = await this.userService.findOneByEmail(email);
    await this.rmqService.ack(context);

    return foundUser;
  }
}
