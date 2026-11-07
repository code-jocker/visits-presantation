import dotenv from "dotenv";
import { Config } from "../types/config-type";
dotenv.config();

const requiredDatabaseSetting = (name: string): string => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required database environment variable: ${name}`);
  }
  return value;
};

const isProduction = process.env.NODE_ENV === "production";

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '1d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    databaseName: process.env.DB_NAME || "defaultdb",
    dialect: "postgres",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },

  bcryptSalRounds: 10,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.VITE_APP_URL || 'http://localhost:3000',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
  isDev: process.env.NODE_ENV === 'development',
  host: process.env.HOST || 'localhost',
};

export default config;
