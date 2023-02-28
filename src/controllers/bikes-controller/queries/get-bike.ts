import { RequestHandler } from 'express';
import MySql from 'mysql2/promise';
import config from '../../../config';
import { BikeModel } from '../types';

export const getBike: RequestHandler<
{ id: string | undefined },
BikeModel | ResponseError,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server set up error' });
    return;
  }

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
  WHERE b.id = ${id}
  GROUP BY b.id`,
  );
  await mySqlConnection.end();

  if (bikes.length === 0) {
    res.status(404).json({ error: `bike with id '${id}' was not found` });
  }

  res.status(200).json(bikes[0]);
};
