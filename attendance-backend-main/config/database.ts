import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "./config";
dotenv.config();


const sequelizeOptions = {
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect,
  logging: config.database.logging,
};

const sequelize = new Sequelize(config.database.databaseName, config.database.user, config.database.password, sequelizeOptions);

export const initializeDatabase = async (): Promise<{ success: boolean; error?: Error }> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.info("Connection to the database has been established successfully.");
    return { success: true };
  } catch (error) {
    const connectionError = error instanceof Error ? error : new Error(String(error));
    console.error(
      `Unable to connect to MySQL at ${config.database.user}@${config.database.host}:${config.database.port}/${config.database.databaseName}. Verify the credentials and matching MySQL user host grants.`,
      connectionError,
    );
    return { success: false, error: connectionError };
  }
};

export default sequelize;
