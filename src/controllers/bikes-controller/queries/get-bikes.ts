import { RequestHandler } from 'express';
import MySql from 'mysql2/promise';
import { BikeModel } from '../types';
import config from '../../../config';

export const getBikes: RequestHandler<
{}, // Paramentrai
BikeModel[], // Atsakymo tipas
{}, // Body: gaunami duomenys
{} // QueryParams: duomenis siunciant get uzklausas, pvz ?min=18max=18
> = async (req, res) => {
  const mySqlConnection = await MySql.createConnection(config.db);
  const [bikes] = await mySqlConnection.query<BikeModel[]>(
    `SELECT 
    b.id, 
    b.brand, 
    b.model, 
    b.year, 
    b.price, 
    JSON_OBJECT(
        'engine', s.engine, 
        'power', s.power, 
        'seatHeight', s.seat_height, 
        'weight', s.weight
        ) as stats, 
    JSON_ARRAYAGG(i.src)
  FROM images as i
  LEFT JOIN bikes as b
  ON i.bikeId = b.id
  LEFT JOIN  stats as s
  ON b.statsId = s.id
  GROUP BY b.id`,
  );
  await mySqlConnection.end();

  res.status(200).json(bikes);
};
