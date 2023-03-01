import * as dotenv from 'dotenv';

dotenv.config();

const {
  SERVER_PORT,
  SERVER_DOMAIN,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
} = process.env;

if (
  SERVER_PORT === undefined
  || SERVER_DOMAIN === undefined
  || DB_HOST === undefined
  || DB_NAME === undefined
  || DB_USER === undefined
  || DB_PASSWORD === undefined
  || DB_PORT === undefined

) {
  throw new Error("Please define constants in '.env' file");
}

const config = {
  server: {
    domain: SERVER_DOMAIN,
    port: SERVER_PORT,
  },
  db: {
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
    multipleStatements: true,
  },
};

export default config;
