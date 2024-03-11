import { config } from 'dotenv';

config();

const knexConfiguration = {
  client: process.env.DB_CLIENT ?? 'pg',
  connection: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    database: process.env.DB_DATABASE ?? 'shopify',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '000000',
    port: parseInt(process.env.DB_PORT, 10) ?? 5432,
  },
  debug: true,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../migrations',
  },
  seeds: {
    directory: '../seeds',
  },
};

export default knexConfiguration;
