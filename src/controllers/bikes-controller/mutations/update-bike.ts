import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import { BikeViewModel, PartialBikeData } from '../types';
import partialBikeDataValidationSchema from '../validation-schemas/partial-bike-data-validation-schema';
import BikeModel from '../model';

export const updateBike: RequestHandler<
{ id: string | undefined },
BikeViewModel | ErrorResponse,
PartialBikeData,
{}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const partialBikeData = partialBikeDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const updatedBike = await BikeModel.updateBike(id, partialBikeData);

    res.status(200).json(updatedBike);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
