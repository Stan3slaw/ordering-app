import type { Credentials } from '../interfaces/credentials.interface';

export interface UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmed: boolean;
  credentials: Credentials;
  created_at: Date;
  updated_at: Date;
}
