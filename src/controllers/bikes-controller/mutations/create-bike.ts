import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import UserModel from 'models/user-model';
import { PartialBikeBody, BikeViewModel } from '../types';
import bikeDataValidationSchema from '../validation-schemas/bike-data-validation-schema';
import BikeModel from '../model';

export const createBike: RequestHandler<
{},
BikeViewModel | ErrorResponse,
PartialBikeBody,
{}
> = async (req, res) => {
  try {
    const bikeData = bikeDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    if (req.authData === undefined) throw new ServerSetupError();
    const user = await UserModel.getUserByEmail(req.authData.email);

    const createdBike = await BikeModel.createBike({ ...bikeData, ownerId: user.id });

    res.status(201).json(createdBike);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
