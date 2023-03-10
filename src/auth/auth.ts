import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import UserModel from '../models/user-model';
import { AuthSuccessResponse } from './types';
import createAuthSuccessResponse from './helpers/create-auth-success-response';

export const auth: RequestHandler<
{},
AuthSuccessResponse | ErrorResponse,
{},
{}
> = async (req, res) => {
  try {
    if (req.authData === undefined) throw new ServerSetupError();
    const user = await UserModel.getUserByEmail(req.authData.email);

    const authSuccessResponse = createAuthSuccessResponse(user);
    res.status(200).json(authSuccessResponse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
