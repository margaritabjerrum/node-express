import mysql from 'mysql2/promise';
import config from '../../../config';
import { BikeViewModel } from '../types';
import SQL from './sql';

export const getBikes = async (): Promise<BikeViewModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const sql = `
    ${SQL.SELECT}
    ${SQL.GROUP}
  `;
  const [bikes] = await mySqlConnection.query<BikeViewModel[]>(sql);

  mySqlConnection.end();

  return bikes;
};
