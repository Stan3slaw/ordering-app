import type { Credentials } from './credentials.interface';

export interface CreateUser {
  email: string;
  name: string;
  password: string;
  confirmed: boolean;
  credentials: Credentials;
}
