import mysql from 'mysql2/promise';
import config from '../config';
import { BikeData, BikeModel } from '../controllers/bikes-controller/types';

type CreateBikeQueryResult =
  [
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    BikeModel[],
  ];

const BIKES_QUERY_SQL_SELECT = `
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
    JSON_ARRAYAGG(i.src) as images
  FROM images as i
  LEFT JOIN bikes as b
  ON i.bikeId = b.id
  LEFT JOIN  stats as s
  ON b.statsId = s.id`;
const BIKES_QUERY_SQL_GROUP = 'GROUP BY b.id;';
const BIKES_QUERY_SQL_WHERE_ID = 'WHERE b.id = ?';

const getBikes = async (): Promise<BikeModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const sql = [BIKES_QUERY_SQL_SELECT, BIKES_QUERY_SQL_GROUP].join('\n');
  const [bikes] = await mySqlConnection.query<BikeModel[]>(sql);

  mySqlConnection.end();

  return bikes;
};

const getBike = async (id: string): Promise<BikeModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = [
    BIKES_QUERY_SQL_SELECT,
    BIKES_QUERY_SQL_WHERE_ID,
    BIKES_QUERY_SQL_GROUP,
  ].join('\n');
  const preparedSqlData = [id];

  const [bikes] = await mySqlConnection.query<BikeModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (bikes.length === 0) {
    throw new Error(`Bike with id <${id}> was not found`);
  }
  return bikes[0];
};

const createBike = async (bikeData: BikeData): Promise<BikeModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    INSERT INTO stats (engine, power, seat_height, weight) VALUES 
    (?, ?, ?, ?);
  
    INSERT INTO bikes (brand, model, price, year, statsId) VALUES
    (?, ?, ?, ?, LAST_INSERT_ID());

    SET @bikeId = LAST_INSERT_ID();
  
    INSERT INTO images (src, bikeId) VALUES
    ${bikeData.images.map(() => '(?, @bikeId)').join(',\n')};

    ${BIKES_QUERY_SQL_SELECT}
    WHERE b.id = @bikeId
    ${BIKES_QUERY_SQL_GROUP}
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

  return createdBike;
};

const BikeService = {
  getBike,
  getBikes,
  createBike,
};

export default BikeService;
