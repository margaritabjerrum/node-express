import { RequestHandler } from 'express';
import ErrorService, { AuthorizationError } from 'services/error-service';
import TokenService from 'services/token-service';

const authMiddleware: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (authorization === undefined) throw new AuthorizationError();

    const token = authorization.split(' ')[1];
    if (token === undefined) throw new AuthorizationError();

    const authData = TokenService.decode(token);
    if (authData === null) throw new AuthorizationError();

    const timestampNow = Math.round(new Date().valueOf() / 1000);
    if (authData.exp < timestampNow) throw new AuthorizationError();

    req.authData = authData;
    next();
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};

export default authMiddleware;
