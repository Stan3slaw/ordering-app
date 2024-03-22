import type { TokenBase } from './token-base.interface';

export interface AccessPayload {
  id: number;
}

export interface AccessToken extends AccessPayload, TokenBase {}
