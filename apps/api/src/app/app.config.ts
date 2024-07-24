import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export const apiConfig = registerAs('api', () => ({
  host: _.defaultTo(process.env.API_HOST, '127.0.0.1'),
  port: _.defaultTo(parseInt(process.env.API_PORT, 10), 3000),
}));

export const dbConfig = registerAs('db', () => {
  return {
    ssl: _.defaultTo(process.env.DB_SSL, 'false'),
    host: _.defaultTo(process.env.DB_HOST, '127.0.0.1'),
    port: _.defaultTo(parseInt(process.env.DB_PORT, 10), 5432),
    user: _.defaultTo(process.env.DB_USER, 'fancy_to_do'),
    pass: _.defaultTo(process.env.DB_PASS, 'fancy_to_do'),
    name: _.defaultTo(process.env.DB_NAME, 'fancy_to_do'),
  };
});

export const jwtConfig = registerAs('jwt', () => {
  return {
    secret: _.defaultTo(process.env.JWT_SECRET, 'fancy-to-do'),
  };
});
