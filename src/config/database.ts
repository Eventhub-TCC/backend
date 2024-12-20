import 'dotenv/config'
import { Sequelize } from 'sequelize';

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DATABASE,
    DB_PORT
  } = process.env;

const sequelize = new Sequelize(DB_DATABASE!, DB_USER!, DB_PASSWORD!, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export default sequelize;