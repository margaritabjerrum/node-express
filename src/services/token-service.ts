import jwt from 'jsonwebtoken';
import config from '../config';

const create = (data: AuthData) => jwt
  .sign(data, config.secret.jwtTokenKey, {
    expiresIn: config.secret.expiresIn,
  });

const decode = (token: string): DecodedAuthData | null => {
  const data = jwt.decode(token);

  if (data === null) return null;
  if (typeof data === 'string') return null;

  return {
    iat: data.iat as number,
    exp: data.exp as number,
    email: data.email,
  };
};

const TokenService = {
  create,
  decode,
};

export default TokenService;
