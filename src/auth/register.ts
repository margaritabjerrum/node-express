import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import ErrorService from '../services/error-service';
import UserModel from './model';
import config from '../config';
import { AuthSuccessResponse, RegistrationData } from './types';
import registrationDataValidationSchema from './validation-schemas/registration-data-validation-schema';
import createAuthSuccessResponse from './helpers/create-auth-success-response';

export const register: RequestHandler<
{},
AuthSuccessResponse | ErrorResponse,
Partial<RegistrationData>,
{}
> = async (req, res) => {
  try {
    const registrationData = registrationDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const user = await UserModel.createUser({
      email: registrationData.email,
      password: await bcrypt.hash(registrationData.password, config.secret.bcryptRounds),
      firstname: registrationData.firstname,
      lastname: registrationData.lastname,
    });

    res.status(200).json(createAuthSuccessResponse(user));
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
