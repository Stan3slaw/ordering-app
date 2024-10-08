import { readFileSync } from 'fs';

import type { Config } from './env-config.interface';

export function envConfig(): Config {
  const publicKey = readFileSync('../keys/public.key', 'utf-8');
  const privateKey = readFileSync('../keys/private.key', 'utf-8');

  return {
    port: parseInt(process.env.PORT, 10),
    appId: process.env.APP_ID,
    rabbitMqUri: process.env.RABBIT_MQ_URI,
    rabbitMqAuthQueue: process.env.RABBIT_MQ_AUTH_QUEUE,
    rabbitMqUserQueue: process.env.RABBIT_MQ_USER_QUEUE,
    domain: process.env.DOMAIN,
    jwt: {
      access: {
        privateKey,
        publicKey,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10),
      },
      confirmation: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
      },
      resetPassword: {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME, 10),
      },
    },
  };
}
