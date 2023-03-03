import { RequestHandler } from 'express';
import BikeService from '../model';
import { BikeViewModel } from '../types';

export const getBike: RequestHandler<
{ id: string | undefined },
BikeViewModel | ResponseError,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server set up error' });
    return;
  }

  try {
    const bike = await BikeService.getBike(id);
    res.status(200).json(bike);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'request error';
    res.status(404).json({ error: message });
  }
};
