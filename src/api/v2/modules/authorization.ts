import { Request, Response, NextFunction } from 'express';

import err from '../../../utils/err';
import getTokenFromHeader from '../../../utils/getTokenFromHeader';
import HttpCodes from '../../../utils/HttpCodes';
import isAuthorized from '../../../utils/isAuthorized';
import roles from '../roles';
import { AuthorizationType } from '../types';

const authorize = async (
  authorizationType: AuthorizationType,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res
      .status(HttpCodes.UNAUTHORIZED)
      .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
  }

  const fn = roles[authorizationType];
  const username = await fn(req);

  if (!username) {
    return res
      .status(HttpCodes.BAD_REQUEST)
      .json(err('Cannot validate authorization', HttpCodes.BAD_REQUEST));
  }

  const auth = isAuthorized(token, username);

  if (!auth) {
    return res
      .status(HttpCodes.UNAUTHORIZED)
      .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
  }

  return next();
};

export default authorize;
