import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import { BikeData, BikeModel } from '../types';
import bikeDataValidationSchema from '../validation-schemas/bike-data-validation-schema';
import BikeService from '../../../services/bikes-service';

export const createBike: RequestHandler<
{},
BikeModel | ResponseError,
BikeData,
{}
> = async (req, res) => {
  try {
    const bikeData: BikeData = bikeDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const createdBike = await BikeService.createBike(bikeData);

    res.status(201).json(createdBike);
  } catch (error) {
    if (error instanceof ValidationError) {
      const manyErrors = error.errors.length > 1;
      res.status(400).json({
        error: manyErrors ? 'Validation errors' : error.errors[0],
        errors: manyErrors ? error.errors : undefined,
      });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
