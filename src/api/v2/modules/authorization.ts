import { Request, Response, NextFunction } from 'express';
import BadRequest from '../../../errors/BadRequest';
import Unauthorized from '../../../errors/Unauthorized';

import getTokenFromHeader from '../../../utils/getTokenFromHeader';
import isAuthorized from '../../../utils/isAuthorized';
import roles from '../roles';
import { AuthorizationType } from '../types';

const authorize = async (
  authorizationType: AuthorizationType,
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    return next(new Unauthorized('Unauthorized'));
  }

  const fn = roles[authorizationType];
  const username = await fn(req);

  if (!username) {
    return next(new BadRequest('Cannot validate authorization'));
  }

  const auth = isAuthorized(token, username);

  if (!auth) {
    return next(new Unauthorized('Unauthorized'));
  }

  return next();
};

export default authorize;
