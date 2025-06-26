import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('domain_validator_db', 'jack_nguyen', 'DumPdGrF9K5y3EXVMzqj7nDggCquRGsv', {
  host: 'dpg-d1eaaf2li9vc739r9nbg-a.singapore-postgres.render.com',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is needed for most cloud DBs!
    }
  }
});

export default sequelize; 