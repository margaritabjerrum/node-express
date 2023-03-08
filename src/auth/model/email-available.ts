import mysql, { RowDataPacket } from 'mysql2/promise';
import config from '../../config';

export const emailAvailable = async (email: string): Promise<boolean> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    SELECT 1
    FROM users
    WHERE email = ?
  `;

  const preparedSqlData = [email];

  const [recordArr] = await mySqlConnection.query<RowDataPacket[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  return recordArr.length === 0;
};
