import { Injectable } from '@nestjs/common';

import type { OAuthProviders } from '@app/common/enums/oauth-providers.enum';

import type { OAuthProviderEntity } from './entities/oauth-provider.entity';
import type { OAuthProviderResponseDto } from './dtos/oauth-provider-response.dto';
import { OAuthProviderRepository } from './oauth-provider.repository';

@Injectable()
export class OauthService {
  constructor(
    private readonly oauthProviderRepository: OAuthProviderRepository,
  ) {}

  private static async mapOAuthProviderEntityToOAuthProviderResponseDto(
    oauthProviderEntity: OAuthProviderEntity,
  ): Promise<OAuthProviderResponseDto> {
    return {
      id: oauthProviderEntity.id,
      provider: oauthProviderEntity.provider,
      userId: oauthProviderEntity.user_id,
      createdAt: oauthProviderEntity.created_at,
      updatedAt: oauthProviderEntity.updated_at,
    };
  }

  async createOAuthProvider(
    provider: OAuthProviders,
    userId: number,
  ): Promise<OAuthProviderResponseDto> {
    const oauthProvider = await this.oauthProviderRepository.create({
      provider,
      user_id: userId,
    });

    const mappedOAuthProviderToResponseDto =
      OauthService.mapOAuthProviderEntityToOAuthProviderResponseDto(
        oauthProvider,
      );

    return mappedOAuthProviderToResponseDto;
  }
}
