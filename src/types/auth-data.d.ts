type AuthData = {
  email: UserEntity['email'],
};

type DecodedAuthData = AuthData & {
  iat: number,
  exp: number,
};
