import { Request } from 'express';
import getToken from './getToken';

const getTokenFromHeader = (req: Request): string | null => {
  if (!req.headers || !req.headers.authorization) {
    return null;
  }

  const header = req.headers.authorization.toString();
  const token = getToken(header);
  return token;
};

export default getTokenFromHeader;
