import { ValidationError } from 'yup';

export class NotFoundError extends Error { }

export class ServerSetupError extends Error {
  constructor() {
    super('Server setup error');
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

const handleError = (err: unknown): [number, ErrorResponse] => {
  let status = 400;
  const errorResponse: ErrorResponse = {
    error: err instanceof Error ? err.message : 'Request error',
  };

  if (err instanceof AuthorizationError) status = 401;
  if (err instanceof NotFoundError) status = 404;
  if (err instanceof ValidationError && err.errors.length > 1) errorResponse.errors = err.errors;

  return [status, errorResponse];
};

const ErrorService = {
  handleError,
};

export default ErrorService;
