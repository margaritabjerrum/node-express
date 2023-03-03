import mysql from 'mysql2/promise';
import config from '../../../config';
import { BikeViewModel, PartialBikeData } from '../types';
import { colonObjectQueryFormat } from '../../../services/my-sql';
import SQL from './sql';

type PrepareSqlResult = [string, Record<string, string>];

type PrepareSql = (bikeData: PartialBikeData) => PrepareSqlResult;

const prepareImagesSql: PrepareSql = (bikeData) => {
  const bindingsOrNull = bikeData.images?.reduce((prevBindings, img, i) => ({
    ...prevBindings,
    [`img${i + 1}`]: img,
  }), {} as Record<string, string>) ?? null;
  const shouldInsert = bindingsOrNull !== null;
  const shouldInsertImages = bikeData.images !== undefined && bikeData.images.length > 0;

  const sql = shouldInsert
    ? `
      DELETE FROM images 
      WHERE images.bikeId = :id;
    
      ${shouldInsertImages ? `INSERT INTO images (src, bikeId) VALUES
        ${Object.keys(bindingsOrNull).map((imgBinding) => `(:${imgBinding}, :id)`).join(',\n')};`
    : ''}
    ` : '';

  const bindings = bindingsOrNull ?? {};

  return [sql, bindings];
};

const prepareBikeSql: PrepareSql = (bikeData) => {
  const propsSql = [
    bikeData.brand !== undefined ? 'brand = :brand' : null,
    bikeData.model !== undefined ? 'model = :model' : null,
    bikeData.year !== undefined ? 'year = :year' : null,
    bikeData.price !== undefined ? 'price = :price' : null,
    bikeData.stats !== undefined ? 'statsId = LAST_INSERT_ID()' : null,
  ].filter((setPropSql) => setPropSql !== null).join(',\n');

  const sql = propsSql.length > 0 ? `
    UPDATE bikes SET
    ${propsSql}
    WHERE bikes.id = :id;
    ` : '';

  const bindings: Record<string, string> = {};
  if (bikeData.brand !== undefined) bindings.brand = bikeData.brand;
  if (bikeData.model !== undefined) bindings.model = String(bikeData.model);
  if (bikeData.year !== undefined) bindings.year = String(bikeData.year);
  if (bikeData.price !== undefined) bindings.price = String(bikeData.price);

  return [sql, bindings];
};

const prepareStatsSql: PrepareSql = (bikeData) => {
  const sql = bikeData.stats !== undefined ? `
  INSERT INTO stats (engine, power, seat_height, weight) VALUES
  (:engine, :power, :seatHeight, :weight);` : '';
  const bindings = bikeData.stats ?? {};

  return [sql, bindings];
};

export const updateBike = async (id: string, bikeData: PartialBikeData): Promise<BikeViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  mySqlConnection.config.queryFormat = colonObjectQueryFormat;

  const [imagesSql, imagesBindings] = prepareImagesSql(bikeData);
  const [statsSql, statsBindings] = prepareStatsSql(bikeData);
  const [bikeSql, bikeBindings] = prepareBikeSql(bikeData);

  const preparedSql = `
    SET @toDeleteStatsId = (select statsId from bikes where id = :id);
    ${imagesSql}
    ${statsSql}
    ${bikeSql}
    DELETE FROM stats WHERE stats.id = @toDeleteStatsId;

    ${SQL.SELECT}
    WHERE b.id = :id
    ${SQL.GROUP}
  `.trim();

  const bindings = {
    id,
    ...imagesBindings,
    ...statsBindings,
    ...bikeBindings,
  };

  const [queryResultsArr] = await mySqlConnection.query<BikeViewModel[]>(preparedSql, bindings);
  const updatedBike = queryResultsArr.at(-1) as BikeViewModel;

  await mySqlConnection.end();

  return updatedBike;
};
