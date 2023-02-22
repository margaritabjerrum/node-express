import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import { BikeModel } from '../types';
import bikes from '../bikes-data';
import partialBikeDataValidationSchema from '../validation-schemas/partial-bike-data-validation-schema';

export const updateBike: RequestHandler<
{ id: string | undefined },
BikeModel | ResponseError,
{},
{}
> = (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server set up error' });
    return;
  }

  const foundBikeIndex = bikes.findIndex((bike) => bike.id === id);
  if (foundBikeIndex === -1) {
    res.status(400).json({ error: `bike was not found with id: ${id}` });
    return;
  }

  try {
    const partialBikeData = partialBikeDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const foundBike = bikes[foundBikeIndex];

    const updatedBike = {
      ...foundBike,
      ...partialBikeData,
    };

    bikes.splice(foundBikeIndex, 1, updatedBike);

    res.status(200).json(updatedBike);
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
