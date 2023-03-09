import mysql from 'mysql2/promise';
import config from 'config';
import { BikeViewModel, BikeData } from '../types';
import SQL from './sql';

type CreateBikeQueryResult =
  [
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    BikeViewModel[],
  ];

export const createBike = async (bikeData: BikeData): Promise<BikeViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
      INSERT INTO stats (engine, power, seat_height, weight) VALUES 
      (?, ?, ?, ?);
    
      INSERT INTO bikes (brand, model, price, year, ownerId, statsId) VALUES
      (?, ?, ?, ?, ?, LAST_INSERT_ID());
  
      SET @bikeId = LAST_INSERT_ID();
    
      INSERT INTO images (src, bikeId) VALUES
      ${bikeData.images.map(() => '(?, @bikeId)').join(',\n')};
  
      ${SQL.SELECT}
      WHERE b.id = @bikeId
      ${SQL.GROUP}
    `;

  const preparedSqlData = [
    bikeData.stats.engine,
    bikeData.stats.power,
    bikeData.stats.seatHeight,
    bikeData.stats.weight,
    bikeData.brand,
    bikeData.model,
    bikeData.price,
    bikeData.year,
    bikeData.ownerId,
    ...bikeData.images,
  ];

  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdBike] = (queryResultsArr as CreateBikeQueryResult)[4];

  await mySqlConnection.end();

  return createdBike;
};
