import type { Credentials } from '../interfaces/credentials.interface';

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmed: boolean;
  credentials: Credentials;
  createdAt: Date;
  updatedAt: Date;
}
