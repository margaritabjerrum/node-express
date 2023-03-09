import { RowDataPacket } from 'mysql2';

export type RegistrationData = Omit<UserEntity, 'id' | 'role'>;

export type RegistrationBody = RegistrationData & {
  passwordConfirmation: string,
};

export type UserEntityRow = UserEntity & RowDataPacket;

export type UserViewModel = Omit<UserEntity, 'password'>;

export type Credentials = {
  email: string,
  password: string,
};

export type CredentialsPartial = Partial<Credentials>;

export type AuthSuccessResponse = {
  token: string,
  user: UserViewModel
};
