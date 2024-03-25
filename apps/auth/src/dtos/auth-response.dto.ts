import type { UserEntity } from 'apps/user/src/entities/user.entity';

export interface AuthResponseDto {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}
