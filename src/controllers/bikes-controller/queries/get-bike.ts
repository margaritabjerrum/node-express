import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import BikeModel from '../model';
import { BikeViewModel } from '../types';

export const getBike: RequestHandler<
{ id: string | undefined },
BikeViewModel | ErrorResponse,
{},
{}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const bike = await BikeModel.getBike(id);
    res.status(200).json(bike);
  } catch (error) {
    const [status, errorResponse] = ErrorService.handleError(error);
    res.status(status).json(errorResponse);
  }
};
