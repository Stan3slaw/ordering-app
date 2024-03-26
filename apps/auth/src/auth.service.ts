import { UnauthorizedException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { compare } from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import dayjs from 'dayjs';

import type { Credentials } from 'apps/user/src/interfaces/credentials.interface';
import type { UserResponseDto } from 'apps/user/src/dtos/user-response.dto';

import type { SignUpDto } from './dtos/sign-up.dto';
import { OAuthProviders } from '../../../libs/common/src/enums/oauth-providers.enum';
import { JwtService } from './modules/jwt/jwt.service';
import { TokenType } from './modules/jwt/enums/token-type.enum';
import { USER_SERVICE } from './constants/services.constants';
import type { SignInDto } from './dtos/sign-in.dto';
import type { AuthResponseDto } from './dtos/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}

  private async checkLastPassword(
    credentials: Credentials,
    password: string,
  ): Promise<void> {
    const { lastPassword, passwordUpdatedAt } = credentials;

    if (lastPassword.length === 0 || !(await compare(password, lastPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const now = dayjs();
    const time = passwordUpdatedAt.toISOString();
    const months = now.diff(time, 'month');
    const message = 'You changed your password ';

    if (months > 0) {
      throw new UnauthorizedException(
        message + months + (months > 1 ? ' months ago' : ' month ago'),
      );
    }

    const days = now.diff(time, 'day');

    if (days > 0) {
      throw new UnauthorizedException(
        message + days + (days > 1 ? ' days ago' : ' day ago'),
      );
    }

    const hours = now.diff(time, 'hour');

    if (hours > 0) {
      throw new UnauthorizedException(
        message + hours + (hours > 1 ? ' hours ago' : ' hour ago'),
      );
    }

    throw new UnauthorizedException(message + 'recently');
  }

  public async signUp(signUpDto: SignUpDto, domain?: string): Promise<string> {
    const { name, email, password, passwordConfirmation } = signUpDto;

    if (password !== passwordConfirmation) {
      throw new UnauthorizedException('Passwords do not match');
    }

    const createdUser: UserResponseDto = await lastValueFrom(
      await this.userClient.send('create_user', {
        provider: OAuthProviders.LOCAL,
        email,
        name,
        password,
      }),
    ).catch((error) => {
      throw error.response;
    });

    const confirmationToken = await this.jwtService.generateToken(
      createdUser,
      TokenType.CONFIRMATION,
      domain,
    );

    console.log({ confirmationToken });

    // TODO: implement mailerService for sending confirmation emails
    // this.mailerService.sendConfirmationEmail(user, confirmationToken);

    return 'Registration successful';
  }

  public async signIn(
    signInDto: SignInDto,
    domain?: string,
  ): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await lastValueFrom(
      await this.userClient.send('find_user_by_email', {
        email,
      }),
    ).catch((error) => {
      throw error.response;
    });

    const isPasswordMatches = await compare(password, user.password);

    if (!isPasswordMatches) {
      await this.checkLastPassword(user.credentials, password);
    }

    // if (!user.confirmed) {
    //   const confirmationToken = await this.jwtService.generateToken(
    //     user,
    //     TokenType.CONFIRMATION,
    //     domain,
    //   );

    //   console.log({ confirmationToken });

    //   // TODO: implement mailerService
    //   // this.mailerService.sendConfirmationEmail(user, confirmationToken);

    //   throw new UnauthorizedException(
    //     'please confirm your email, a new email has been sent',
    //   );
    // }

    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, domain);

    const {
      password: _password,
      credentials: _credentials,
      ...userWithoutSensitiveData
    } = user;

    return { user: userWithoutSensitiveData, accessToken, refreshToken };
  }
}
