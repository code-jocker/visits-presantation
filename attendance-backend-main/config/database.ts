import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "./config";
dotenv.config();

const requiredEnv = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  databaseName: config.database.databaseName,
};

// If DATABASE_URL is provided (Render/Postgres), use it.
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && !requiredEnv.databaseName) {
  console.error(
    "❌ Database configuration error: DB_NAME is missing and DATABASE_URL is not set. " +
      "Set DB_NAME=visitors (MySQL) or DATABASE_URL=<postgres connection string>."
  );
}

const sequelizeOptions: any = {
  logging: false,
};

let sequelize: Sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    dialectModule: undefined,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  });
} else {
  sequelizeOptions.host = requiredEnv.host;
  sequelizeOptions.port = requiredEnv.port;
  sequelizeOptions.dialect = config.database.dialect;

  sequelize = new Sequelize(
    requiredEnv.databaseName,
    requiredEnv.user,
    requiredEnv.password,
    sequelizeOptions
  );
}


export const initializeDatabase = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    if (!process.env.DATABASE_URL && !config.database.databaseName) {
      throw new Error(
        "DB_NAME is missing. Please set DB_NAME (MySQL) or DATABASE_URL (<postgres connection string>) so Sequelize connects to the correct database."
      );
    }

    await sequelize.authenticate();

    // Note: schema changes (e.g. ALTER TABLE) should be managed via Sequelize migrations,
    // not run on every application startup.
    // eslint-disable-next-line no-console
    console.info("Connection to the database has been established successfully.");
    return { success: true };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return { success: false, error };
  }
};

export default sequelize;
