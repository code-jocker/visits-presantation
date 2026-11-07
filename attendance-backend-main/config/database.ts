import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "./config";
dotenv.config();

const databaseUrl = process.env.DATABASE_URL?.replace(/[?&]sslmode=\w+/, "");

const sequelizeOptions: any = {
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect as any,
  logging: config.database.logging,
  dialectOptions: config.database.dialectOptions,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, sequelizeOptions)
  : new Sequelize(config.database.databaseName, config.database.user, config.database.password, sequelizeOptions);

export const initializeDatabase = async (): Promise<{ success: boolean; error?: Error }> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.info("Connection to the database has been established successfully.");
    return { success: true };
  } catch (error) {
    const connectionError = error instanceof Error ? error : new Error(String(error));
    console.error(
      `Unable to connect to database at ${config.database.user}@${config.database.host}:${config.database.port}/${config.database.databaseName}. Verify the credentials.`,
      connectionError,
    );
    return { success: false, error: connectionError };
  }
};

export default sequelize;
