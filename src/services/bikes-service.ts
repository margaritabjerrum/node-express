import mysql from 'mysql2/promise';
import config from '../config';
import { BikeModel } from '../controllers/bikes-controller/types';

type BikesQuerySettings = undefined | {
  bikeId: string
};

type BikesQueryResult<T extends BikesQuerySettings> =
  T extends undefined ? BikeModel[] : BikeModel;

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

const bikesQuery = async <T extends BikesQuerySettings = undefined>(
  settings?: T,
) => {
  const mySqlConnection = await mysql.createConnection(config.db);
  let result: BikeModel | BikeModel[];

  if (settings === undefined) {
    const [bikes] = await mySqlConnection.query<BikeModel[]>(
      [BIKES_QUERY_SQL_SELECT, BIKES_QUERY_SQL_GROUP].join('\n'),
    );

    result = bikes;
  } else {
    const preparedSql = [
      BIKES_QUERY_SQL_SELECT,
      BIKES_QUERY_SQL_WHERE_ID,
      BIKES_QUERY_SQL_GROUP,
    ].join('\n');
    const preparedSqlData = [settings.bikeId];

    const [bikes] = await mySqlConnection.query<BikeModel[]>(preparedSql, preparedSqlData);

    if (bikes.length === 0) {
      throw new Error(`Bike with id <${settings.bikeId}> was not found`);
    }
    const [bike] = bikes;

    result = bike;
  }
  await mySqlConnection.end();

  return result as BikesQueryResult<T>;
};

const getBikes = async (): Promise<BikeModel[]> => {
  const bikes = await bikesQuery();

  return bikes;
};

const getBike = async (id: string): Promise<BikeModel> => {
  const bike = await bikesQuery({ bikeId: id });

  return bike;
};

const BikeService = {
  getBike,
  getBikes,
};

export default BikeService;
