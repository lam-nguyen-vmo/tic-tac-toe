import * as dotenv from 'dotenv';

dotenv.config();

export const getEnv = (key: string): string => {
  const value = process.env[key];
  return value;
};

// Configs
export const NODE_ENV = getEnv('NODE_ENV');
export const NODE_APP_PORT = Number(getEnv('NODE_APP_PORT'));

export const SWAGGER_PATH = getEnv('SWAGGER_PATH');

export const DB_TYPE = 'postgres';
export const DB_HOST = getEnv('DB_HOST');
export const DB_PORT = Number(getEnv('DB_PORT'));
export const DB_USERNAME = getEnv('DB_USERNAME');
export const DB_PASSWORD = getEnv('DB_PASSWORD');
export const DB_DATABASE_NAME = getEnv('DB_DATABASE_NAME');
