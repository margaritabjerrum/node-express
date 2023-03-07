import jwt from 'jsonwebtoken';
import config from '../config';

const createToken = (email: string, role: string) => jwt
  .sign({ email, role }, config.secret.jwtTokenKey);

const TokenService = {
  createToken,
};

export default TokenService;
