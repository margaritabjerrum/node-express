import { RequestHandler } from 'express';
import { BikeModel } from '../types';
import bikes from '../bikes-data';

export const deleteBike: RequestHandler<
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

  const foundBikeIndex = bikes.findIndex((bike) => bike.id === id);
  if (foundBikeIndex === -1) {
    res.status(400).json({ error: `bike was not found with id: ${id}` });
    return;
  }

  const [deletedBike] = bikes.splice(foundBikeIndex, 1);

  res.status(200).json(deletedBike);
};
