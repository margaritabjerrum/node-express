import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError, ForbiddenError } from 'services/error-service';
import UserModel from 'models/user-model';
import { BikeViewModel, PartialBikeBody } from '../types';
import partialBikeDataValidationSchema from '../validation-schemas/partial-bike-data-validation-schema';
import BikeModel from '../model';

export const updateBike: RequestHandler<
{ id: string | undefined },
BikeViewModel | ErrorResponse,
PartialBikeBody,
{}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    if (req.authData === undefined) throw new ServerSetupError();
    const partialBikeData = partialBikeDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const user = await UserModel.getUserByEmail(req.authData.email);
    const bike = await BikeModel.getBike(id);
    if (user.role !== 'ADMIN' && user.id !== bike.owner.id) throw new ForbiddenError();

    const updatedBike = await BikeModel.updateBike(id, partialBikeData);

    res.status(200).json(updatedBike);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
