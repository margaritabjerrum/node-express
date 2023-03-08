declare global {
  namespace Express {
    export interface Request {
      authData: DecodedAuthData
    }
  }
}

export { };
