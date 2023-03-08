import mysql from 'mysql2/promise';
import config from 'config';
import { NotFoundError } from 'services/error-service';
import { BikeViewModel } from '../types';
import SQL from './sql';

export const getBike = async (id: string): Promise<BikeViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    ${SQL.SELECT}
    WHERE b.id = ?
    ${SQL.GROUP}
  `;

  const preparedSqlData = [id];

  const [bikes] = await mySqlConnection.query<BikeViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (bikes.length === 0) throw new NotFoundError(`Bike with id <${id}> was not found`);

  return bikes[0];
};
