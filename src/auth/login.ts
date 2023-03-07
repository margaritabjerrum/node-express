import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import ErrorService from '../services/error-service';
import UserModel from './model';
import { CredentialsPartial, AuthSuccessResponse } from './types';
import credentialsValidationSchema from './validation-schemas/credentials-validation-schema';
import createAuthSuccessResponse from './helpers/create-auth-success-response';

export const login: RequestHandler<
{},
AuthSuccessResponse | ErrorResponse,
CredentialsPartial,
{}
> = async (req, res) => {
  try {
    const credentials = credentialsValidationSchema
      .validateSync(req.body, { abortEarly: false });
    const user = await UserModel.getUser(credentials.email);

    const validPassword = await bcrypt.compare(credentials.password, user.password);

    if (!validPassword) throw new Error('Incorect password');

    res.status(200).json(createAuthSuccessResponse(user));
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
