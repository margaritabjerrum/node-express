import mysql from 'mysql2/promise';
import config from '../config';
import { BikeData, BikeModel, PartialBikeData } from '../controllers/bikes-controller/types';
import { colonObjectQueryFormat } from './my-sql';

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

const updateBike = async (id: string, bikeData: PartialBikeData): Promise<BikeModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  mySqlConnection.config.queryFormat = colonObjectQueryFormat;

  // Images SQL
  const imagesBindings = bikeData.images?.reduce((prevBindings, img, i) => ({
    ...prevBindings,
    [`img${i + 1}`]: img,
  }), {} as Record<string, string>) ?? null;
  const shouldAddNewImages = bikeData.images !== undefined && bikeData.images.length > 0;
  const imagesUpdatePreparedSql = imagesBindings !== null
    ? `
      DELETE FROM images 
      WHERE images.bikeId = :id;
    
      ${shouldAddNewImages ? `INSERT INTO images (src, bikeId) VALUES
        ${Object.keys(imagesBindings).map((imgBinding) => `(:${imgBinding}, :id)`).join(',\n')};`
    : ''}
    ` : '';

  // Stats SQL
  const statsExist = bikeData.stats !== undefined;
  const statsInsertSql = statsExist ? `
    INSERT INTO stats (engine, power, seat_height, weight) VALUES
    (:engine, :power, :seatHeight, :weight);` : '';

  // Property SQL
  const bikeSetPropsSql = [
    bikeData.brand !== undefined ? 'brand = :brand' : null,
    bikeData.model !== undefined ? 'model = :model' : null,
    bikeData.year !== undefined ? 'year = :year' : null,
    bikeData.price !== undefined ? 'price = :price' : null,
    statsExist ? 'statsId = LAST_INSERT_ID()' : null,
  ].filter((setPropSql) => setPropSql !== null).join(',\n');

  const preparedSql = `
    ${imagesUpdatePreparedSql}
    ${statsInsertSql}

    ${bikeSetPropsSql.length > 0 ? `
    UPDATE bikes SET
      ${bikeSetPropsSql}
      WHERE bikes.id = :id;
    ` : ''}

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
      JSON_ARRAYAGG(i.src)
    FROM images as i
    LEFT JOIN bikes as b
    ON i.bikeId = b.id
    LEFT JOIN  stats as s
    ON b.statsId = s.id
    WHERE b.id = :id
    GROUP BY b.id
  `.trim();

  const bindings = {
    id,
    ...imagesBindings,
    ...bikeData.stats,
    brand: bikeData.brand,
    model: bikeData.model,
    year: bikeData.year,
    price: bikeData.price,
  };

  const [queryResultsArr] = await mySqlConnection.query<BikeModel[]>(preparedSql, bindings);
  const updatedBike = queryResultsArr.at(-1) as BikeModel;

  console.log(preparedSql);
  console.log(bindings);

  await mySqlConnection.end();

  return updatedBike;
};

const deleteBike = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    DELETE FROM images WHERE bikeId = ?;
    DELETE from bikes WHERE id = ?;
    `;
  const preparedSqlData = [id, id];

  await mySqlConnection.query<BikeModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};

const BikeService = {
  getBike,
  getBikes,
  createBike,
  deleteBike,
  updateBike,
};

export default BikeService;
