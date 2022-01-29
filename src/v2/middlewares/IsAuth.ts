import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from 'routing-controllers';
import getTokenFromHeader from '../utils/getTokenFromHeader';

const IsAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    throw new UnauthorizedError('Invalid authorization token');
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!verified) {
    throw new UnauthorizedError('Invalid authorization token');
  }

  return next();
};

export default IsAuth;
