import mysql from 'mysql2/promise';
import config from '../../config';
import BcryptService from '../../services/bcrypt-service';
import { UserEntityRow } from '../types';
import SQL from './sql';

type UserData = {
  email: string,
  password: string,
  firstname: string,
  lastname:string,
};

export const createUser = async ({
  email,
  password,
  firstname,
  lastname,
}: UserData): Promise<UserEntityRow> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
  INSERT INTO users (email, password, firstname, lastname) VALUES 
  (?, ?, ?, ?);

  ${SQL.SELECT}
  WHERE u.id = LAST_INSERT_ID()
  `;

  const preparedSqlData = [
    email,
    BcryptService.hash(password),
    firstname,
    lastname,
  ];
  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdUser] = (queryResultsArr as UserEntityRow[][])[1];

  await mySqlConnection.end();

  return createdUser;
};
