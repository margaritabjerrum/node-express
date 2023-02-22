import { RequestHandler } from 'express';
import { BikeModel } from './types';
import bikes from './bikes-data';

export const getBikes: RequestHandler<
{}, // Paramentrai
BikeModel[], // Atsakymo tipas
{}, // Body: gaunami duomenys
{} // QueryParams: duomenis siunciant get uzklausas, pvz ?min=18max=18
> = (req, res) => {
  res.status(200).json(bikes);
};
