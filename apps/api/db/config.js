require('dotenv').config();

const _ = require('lodash');

const RADIX = 10;

/** @type {import('sequelize').Options['dialect']} */
const dialect = 'postgres';

/** @type {import('sequelize').Options} */
const defaultConfig = {
  dialect,
  dialectOptions: {
    ssl:
      _.defaultTo(process.env.DB_SSL, 'false') === 'true'
        ? {
            require: true,
            rejectUnauthorized: true,
          }
        : undefined,
  },
  host: _.defaultTo(process.env.DB_HOST, '127.0.0.1'),
  port: _.defaultTo(parseInt(process.env.DB_PORT, RADIX), 5432),
  username: _.defaultTo(process.env.DB_USER, 'fancy_to_do'),
  password: _.defaultTo(process.env.DB_PASS, 'fancy_to_do'),
  database: _.defaultTo(process.env.DB_NAME, 'fancy_to_do'),
};

/** @type {Record<'development' | 'test' | 'production', import('sequelize').Options>} */
const config = {
  development: defaultConfig,
  test: defaultConfig,
  production: defaultConfig,
};

module.exports = config;
