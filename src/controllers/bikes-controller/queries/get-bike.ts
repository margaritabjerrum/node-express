import { RequestHandler } from 'express';
import { BikeModel } from '../types';
import bikes from '../bikes-data';

export const getBike: RequestHandler<
{ id: string | undefined },
BikeModel | ResponseError,
{},
{}
> = (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server set up error' });
    return;
  }

  const foundBike = bikes.find((bike) => bike.id === id);
  if (foundBike === undefined) {
    res.status(400).json({ error: `bike was not found with id: ${id}` });
    return;
  }
  res.status(200).json(foundBike);
};
