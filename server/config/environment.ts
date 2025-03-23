import dotenv from 'dotenv';

dotenv.config();

const {
  DEV_DB_URL: dbDev,
  TEST_DB_URL: dbTest,
  DATABASE_URL: dbProduction,
  NODE_ENV: nodeEnv,
  SECRET_KEY: secretKey,
} = process.env;

export { dbDev, dbTest, dbProduction, nodeEnv, secretKey };