import { Sequelize, DataTypes } from 'sequelize';
import 'dotenv/config';

let { CITEXT } = DataTypes;

CITEXT = DataTypes.CITEXT || DataTypes.STRING;

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;
if (!DB_HOST || !DB_USERNAME || !DB_PASSWORD || !DB_DATABASE) throw Error('Database credential not found');


export const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    dialectOptions: {
        useUTC: false,
    }
});

export const initializeDatabase = async (): Promise<Sequelize> => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
        return sequelize;
    } catch (err) {
        console.log(`Error on database connecting ${err.message}`);
        process.exit(1);
    }
};