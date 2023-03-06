import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ErrorService from '../services/error-service';
import UserModel from './model';
import { CredentialsPartial, AuthSuccessResponse, UserViewModel } from './types';
import credentialsValidationSchema from './validation-schemas/credentials-validation-schema';
import config from '../config';

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
    const token = jwt.sign({ email: user.email, role: user.role }, config.secret.jwtTokenKey);

    const hashedPassword = await bcrypt.hash(credentials.password, config.secret.bcryptRounds);
    console.log(hashedPassword);

    const userViewModel: UserViewModel = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };

    res.status(200).json({
      token,
      user: userViewModel,
    });
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
