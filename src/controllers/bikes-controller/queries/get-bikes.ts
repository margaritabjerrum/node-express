import { RequestHandler } from 'express';
import { BikeViewModel } from '../types';
import BikeService from '../model';

export const getBikes: RequestHandler<
{}, // Paramentrai
BikeViewModel[], // Atsakymo tipas
{}, // Body: gaunami duomenys
{} // QueryParams: duomenis siunciant get uzklausas, pvz ?min=18max=18
> = async (req, res) => {
  const bikes = await BikeService.getBikes();

  res.status(200).json(bikes);
};
