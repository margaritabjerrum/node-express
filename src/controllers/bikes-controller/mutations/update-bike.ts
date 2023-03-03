import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import { BikeViewModel, PartialBikeData } from '../types';
import partialBikeDataValidationSchema from '../validation-schemas/partial-bike-data-validation-schema';
import BikeService from '../model';

export const updateBike: RequestHandler<
{ id: string | undefined },
BikeViewModel | ResponseError,
PartialBikeData,
{}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server set up error' });
    return;
  }

  try {
    const partialBikeData = partialBikeDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const updatedBike = await BikeService.updateBike(id, partialBikeData);

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
