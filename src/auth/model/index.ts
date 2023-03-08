import { getUser } from './get-user';
import { createUser } from './create-user';
import { emailAvailable } from './email-available';

const UserModel = {
  getUser,
  createUser,
  emailAvailable,
};

export default UserModel;
