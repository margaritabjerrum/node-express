import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import { BikeData, BikeViewModel } from '../types';
import bikeDataValidationSchema from '../validation-schemas/bike-data-validation-schema';
import BikeModel from '../model';

export const createBike: RequestHandler<
{},
BikeViewModel | ErrorResponse,
BikeData,
{}
> = async (req, res) => {
  try {
    const bikeData: BikeData = bikeDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const createdBike = await BikeModel.createBike(bikeData);

    res.status(201).json(createdBike);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
