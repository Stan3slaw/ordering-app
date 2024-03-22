import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

import type { SignUpDto } from './dtos/sign-up.dto';
import { OAuthProviders } from '../../../libs/common/src/enums/oauth-providers.enum';
import { JwtService } from './modules/jwt/jwt.service';
import { TokenType } from './modules/jwt/enums/token-type.enum';
import { USER_SERVICE } from './constants/services.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}

  private comparePasswords(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
  }

  public async signUp(signUpDto: SignUpDto, domain?: string): Promise<string> {
    const { name, email, password, passwordConfirmation } = signUpDto;

    this.comparePasswords(password, passwordConfirmation);

    const createdUser = await lastValueFrom(
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
}
