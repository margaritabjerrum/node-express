import { RequestHandler } from 'express';
import { BikeModel } from '../types';
import BikeService from '../../../services/bikes-service';

export const getBikes: RequestHandler<
{}, // Paramentrai
BikeModel[], // Atsakymo tipas
{}, // Body: gaunami duomenys
{} // QueryParams: duomenis siunciant get uzklausas, pvz ?min=18max=18
> = async (req, res) => {
  const bikes = await BikeService.getBikes();

  res.status(200).json(bikes);
};
