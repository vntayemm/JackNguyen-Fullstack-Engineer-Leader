import { Sequelize } from 'sequelize';
import config from '../config.js';

const sequelize = new Sequelize(config.DATABASE.database, config.DATABASE.username, config.DATABASE.password, {
  host: config.DATABASE.host,
  dialect: 'postgres',
  port: config.DATABASE.port,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is needed for most cloud DBs!
    }
  }
});

export default sequelize; 