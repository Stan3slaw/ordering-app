import type { OAuthProviders } from '@app/common/enums/oauth-providers.enum';

export interface CreateOAuthProviderDto {
  provider: OAuthProviders;
  userId: number;
}
