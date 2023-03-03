import { RequestHandler } from 'express';
import ErrorService from '../../../services/error-service';
import { BikeViewModel } from '../types';
import BikeModel from '../model';

export const getBikes: RequestHandler<
{}, // Paramentrai
BikeViewModel[] | ErrorResponse, // Atsakymo tipas
{}, // Body: gaunami duomenys
{} // QueryParams: duomenis siunciant get uzklausas, pvz ?min=18max=18
> = async (req, res) => {
  try {
    const bikes = await BikeModel.getBikes();
    res.status(200).json(bikes);
  } catch (error) {
    const [status, errorResponse] = ErrorService.handleError(error);
    res.status(status).json(errorResponse);
  }
};
