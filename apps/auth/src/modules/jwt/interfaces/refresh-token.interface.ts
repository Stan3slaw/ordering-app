import type { EmailPayload } from './email-token.interface';
import type { TokenBase } from './token-base.interface';

export interface RefreshPayload extends EmailPayload {
  tokenId: string;
}

export interface RefreshToken extends RefreshPayload, TokenBase {}
