import mysql from 'mysql2/promise';
import config from 'config';
import { NotFoundError } from 'services/error-service';
import { UserEntityRow } from '../types';
import SQL from './sql';

export const getUser = async (email: string): Promise<UserEntityRow> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    ${SQL.SELECT}
    WHERE u.email = ?;
  `;

  const preparedSqlData = [email];

  const [users] = await mySqlConnection.query<UserEntityRow[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (users.length === 0) throw new NotFoundError(`user with id <${email}> was not found`);

  return users[0];
};
