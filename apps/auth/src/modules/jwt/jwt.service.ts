import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

import { throwInternalError } from '@app/common/utils/error-handler.util';

import type { UserResponseDto } from 'apps/user/src/dtos/user-response.dto';

import type { Jwt } from './interfaces/jwt.interface';
import { TokenType } from './enums/token-type.enum';
import type {
  AccessPayload,
  AccessToken,
} from './interfaces/access-token.interface';
import type {
  EmailPayload,
  EmailToken,
} from './interfaces/email-token.interface';
import type {
  RefreshPayload,
  RefreshToken,
} from './interfaces/refresh-token.interface';

@Injectable()
export class JwtService {
  private readonly jwtConfig: Jwt;
  private readonly issuer: string;
  private readonly domain: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtConfig = this.configService.get<Jwt>('jwt');
    this.issuer = this.configService.get<string>('appId');
    this.domain = this.configService.get<string>('domain');
  }

  private async generateTokenAsync(
    payload: AccessPayload | EmailPayload | RefreshPayload,
    secret: string,
    options: jwt.SignOptions,
  ): Promise<string> {
    return new Promise((resolve, rejects) => {
      jwt.sign(payload, secret, options, (error, token) => {
        if (error) {
          rejects(error);

          return;
        }
        resolve(token);
      });
    });
  }

  private async verifyTokenAsync<T>(
    token: string,
    secret: string,
    options: jwt.VerifyOptions,
  ): Promise<T> {
    return new Promise((resolve, rejects) => {
      jwt.verify(token, secret, options, (error, payload: T) => {
        if (error) {
          rejects(error);

          return;
        }
        resolve(payload);
      });
    });
  }

  private async throwBadRequest<
    T extends AccessToken | RefreshToken | EmailToken,
  >(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestException('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestException('Invalid token');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async generateToken(
    user: UserResponseDto,
    tokenType: TokenType,
    domain?: string | null,
    tokenId?: string,
  ): Promise<string> {
    const jwtOptions: jwt.SignOptions = {
      issuer: this.issuer,
      subject: user.email,
      audience: domain ?? this.domain,
      algorithm: 'HS256',
    };

    switch (tokenType) {
      case TokenType.ACCESS:
        const { privateKey, time: accessTime } = this.jwtConfig.access;

        return throwInternalError(
          this.generateTokenAsync({ id: user.id }, privateKey, {
            ...jwtOptions,
            expiresIn: accessTime,
            algorithm: 'RS256',
          }),
        );
      case TokenType.REFRESH:
        const { secret: refreshSecret, time: refreshTime } =
          this.jwtConfig.refresh;

        return throwInternalError(
          this.generateTokenAsync(
            {
              id: user.id,
              version: user.credentials.version,
              tokenId: tokenId ?? v4(),
            },
            refreshSecret,
            {
              ...jwtOptions,
              expiresIn: refreshTime,
            },
          ),
        );
      case TokenType.CONFIRMATION:
      case TokenType.RESET_PASSWORD:
        const { secret, time } = this.jwtConfig[tokenType];

        return throwInternalError(
          this.generateTokenAsync(
            { id: user.id, version: user.credentials.version },
            secret,
            {
              ...jwtOptions,
              expiresIn: time,
            },
          ),
        );
    }
  }

  async verifyToken<T extends AccessToken | RefreshToken | EmailToken>(
    token: string,
    tokenType: TokenType,
  ): Promise<T> {
    const jwtOptions: jwt.VerifyOptions = {
      issuer: this.issuer,
      audience: new RegExp(this.domain),
    };

    switch (tokenType) {
      case TokenType.ACCESS:
        const { publicKey, time: accessTime } = this.jwtConfig.access;

        return this.throwBadRequest(
          this.verifyTokenAsync(token, publicKey, {
            ...jwtOptions,
            maxAge: accessTime,
            algorithms: ['RS256'],
          }),
        );
      case TokenType.REFRESH:
      case TokenType.CONFIRMATION:
      case TokenType.RESET_PASSWORD:
        const { secret, time } = this.jwtConfig[tokenType];

        return this.throwBadRequest(
          this.verifyTokenAsync(token, secret, {
            ...jwtOptions,
            maxAge: time,
            algorithms: ['HS256'],
          }),
        );
    }
  }

  async generateAuthTokens(
    user: UserResponseDto,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.generateToken(user, TokenType.ACCESS, domain, tokenId),
      this.generateToken(user, TokenType.REFRESH, domain, tokenId),
    ]);
  }
}
