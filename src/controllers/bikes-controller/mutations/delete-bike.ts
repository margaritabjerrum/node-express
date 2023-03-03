import { RequestHandler } from 'express';
import { BikeViewModel } from '../types';
import BikeService from '../model';

export const deleteBike: RequestHandler<
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
    await BikeService.deleteBike(id);

    res.status(200).json(bike);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
