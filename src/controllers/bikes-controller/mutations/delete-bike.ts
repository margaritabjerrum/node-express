import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError, ForbiddenError } from 'services/error-service';
import UserModel from 'models/user-model';
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
    if (req.authData === undefined) throw new ServerSetupError();
    const user = await UserModel.getUserByEmail(req.authData.email);
    const bike = await BikeModel.getBike(id);

    if (user.role !== 'ADMIN' && user.id !== bike.owner.id) throw new ForbiddenError();

    await BikeModel.deleteBike(id);

    res.status(200).json(bike);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
