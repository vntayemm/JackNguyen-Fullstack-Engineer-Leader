import { Sequelize } from 'sequelize';
import config from '../config.js';

// Use DATABASE_URL if provided, otherwise use individual database config
const sequelize = new Sequelize(
  process.env.DATABASE_URL || {
    host: config.DATABASE.host,
    port: config.DATABASE.port,
    database: config.DATABASE.database,
    username: config.DATABASE.username,
    password: config.DATABASE.password,
    dialect: config.DATABASE.dialect,
    logging: config.DATABASE.logging,
    pool: config.DATABASE.pool,
    dialectOptions: config.DATABASE.dialectOptions
  }
);

export default sequelize; 