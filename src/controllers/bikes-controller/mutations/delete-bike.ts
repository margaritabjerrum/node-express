import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import { BikeViewModel } from '../types';
import BikeModel from '../model';

export const deleteBike: RequestHandler<
{ id: string | undefined },
BikeViewModel | ErrorResponse,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const bike = await BikeModel.getBike(id);
    await BikeModel.deleteBike(id);

    res.status(200).json(bike);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
