type AuthData = {
  email: UserEntity['email'],
  role: UserEntity['role'],
};

type DecodedAuthData = AuthData & {
  iat: number,
};
