import type { OAuthProviders } from '@app/common/enums/oauth-providers.enum';

export interface CreateUserDto {
  provider: OAuthProviders;
  email: string;
  name: string;
  password: string;
}
