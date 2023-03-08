import mysql from 'mysql2/promise';
import config from 'config';
import { BikeViewModel } from '../types';

export const deleteBike = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    SET @deletedBikeStatsId = (select statsId from bikes where id = ?);
    DELETE FROM images WHERE images.bikeId = ?;  
    DELETE FROM bikes WHERE id = ?;  
    DELETE FROM stats WHERE stats.id = @deletedBikeStatsId;
  `;
  const preparedSqlData = [id, id, id];

  await mySqlConnection.query<BikeViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};
