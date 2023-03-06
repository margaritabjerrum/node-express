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
  JWT_TOKEN_KEY,
  BCRYPT_ROUNDS,
} = process.env;

if (
  !SERVER_PORT
  || !SERVER_DOMAIN

  || !DB_HOST
  || !DB_NAME
  || !DB_USER
  || !DB_PASSWORD
  || !DB_PORT

  || !JWT_TOKEN_KEY

  || !BCRYPT_ROUNDS

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
  secret: {
    jwtTokenKey: JWT_TOKEN_KEY,
    bcryptRounds: Number(BCRYPT_ROUNDS),
  },
};

export default config;
