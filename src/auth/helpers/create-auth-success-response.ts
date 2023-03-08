import TokenService from 'services/token-service';
import { AuthSuccessResponse, UserViewModel, UserEntityRow } from '../types';

const createAuthSuccessResponse = (user: UserEntityRow):AuthSuccessResponse => {
  const token = TokenService.create({ email: user.email, role: user.role });
  const userViewModel: UserViewModel = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
  };
  return {
    token,
    user: userViewModel,
  };
};

export default createAuthSuccessResponse;
