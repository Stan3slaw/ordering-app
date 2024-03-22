import type { Jwt } from '../modules/jwt/interfaces/jwt.interface';

export interface Config {
  port: number;
  appId: string;
  rabbitMqUri: string;
  rabbitMqAuthQueue: string;
  rabbitMqUserQueue: string;
  domain: string;
  jwt: Jwt;
}
