import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import mysql from 'mysql2/promise';
import config from '../../../config';
import { BikeData, BikeModel } from '../types';
import bikeDataValidationSchema from '../validation-schemas/bike-data-validation-schema';

type CreateBikeQueryResult =
  [
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    BikeModel[],
  ];

export const createBike: RequestHandler<
{},
BikeModel | ResponseError,
BikeData,
{}
> = async (req, res) => {
  try {
    const bikeData: BikeData = bikeDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const mySqlConnection = await mysql.createConnection(config.db);
    const preparedSql = `
        INSERT INTO stats (engine, power, seat_height, weight) VALUES 
        (?, ?, ?, ?);
  
        INSERT INTO bikes (brand, model, price, year, statsId) VALUES
        (?, ?, ?, ?, LAST_INSERT_ID());

        SET @bikeId = LAST_INSERT_ID();
  
        INSERT INTO images (src, bikeId) VALUES
        ${bikeData.images.map(() => '(?, @bikeId)').join(',\n')};

        SELECT 
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
        IF(COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as images
      FROM images as i
      LEFT JOIN bikes as b
      ON i.bikeId = b.id
      LEFT JOIN  stats as s
      ON b.statsId = s.id
      WHERE b.id = @bikeId
      GROUP BY b.id
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
      ...bikeData.images,
    ];

    const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
    const [createdBike] = (queryResultsArr as CreateBikeQueryResult)[4];

    await mySqlConnection.end();

    res.status(201).json(createdBike);
  } catch (error) {
    if (error instanceof ValidationError) {
      const manyErrors = error.errors.length > 1;
      res.status(400).json({
        error: manyErrors ? 'Validation errors' : error.errors[0],
        errors: manyErrors ? error.errors : undefined,
      });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
