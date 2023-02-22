import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import createId from 'uniqid';
import { BikeData, BikeModel } from '../types';
import bikes from '../bikes-data';
import bikeDataValidationSchema from '../validation-schemas/bike-data-validation-schema';

export const createBike: RequestHandler<
{},
BikeModel | ResponseError,
BikeData,
{}
> = (req, res) => {
  try {
    const bikeData = bikeDataValidationSchema.validateSync(req.body, { abortEarly: false });
    const newBike: BikeModel = { id: createId(), ...bikeData };
    bikes.push(newBike);
    res.status(201).json(newBike);
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
