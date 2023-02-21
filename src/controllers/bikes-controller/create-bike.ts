import { RequestHandler } from 'express';
import BikeModel from './bike-model';
import bikes from './bikes-data';

const isBikeData = (
  potentialBikeData: PartialBikeData | BikeData,
): potentialBikeData is BikeData => {
  const {
    brand, model, year, price, stats, images,
  } = potentialBikeData;

  if (typeof brand !== 'string') return false;
  if (typeof model !== 'string') return false;
  if (typeof year !== 'number') return false;
  if (typeof price !== 'number') return false;
  if (stats === null || typeof stats !== 'object') return false;
  if (typeof stats.engine !== 'string') return false;
  if (typeof stats.power !== 'string') return false;
  if (typeof stats.seatHeight !== 'string') return false;
  if (typeof stats.weight !== 'string') return false;
  if (!Array.isArray(images)) return false;
  if (images.some((img) => typeof img !== 'string')) return false;

  return true;
};

type BikeData = Omit<BikeModel, 'id'>;
type PartialBikeData = PartialRecursive<BikeData>;

export const createBike: RequestHandler<
{}, // Paramentrai
BikeModel | ResponseError, // Atsakymo tipas
PartialBikeData, // Body: gaunami duomenys
{} // QueryParams: duomenis siunciant get uzklausas, pvz ?min=18max=18
> = (req, res) => {
  const bikeData = req.body;
  if (!isBikeData(bikeData)) {
    res.status(400).json({ errorMessage: 'Incorrect data' });
    return;
  }
  const newBike = { id: '6', ...bikeData };
  bikes.push(newBike);
  res.status(201).json(newBike);
};
