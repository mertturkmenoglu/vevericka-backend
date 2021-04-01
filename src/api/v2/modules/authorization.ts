import { Request, Response, NextFunction } from 'express';

import err from '../../../utils/err';
import getTokenFromHeader from '../../../utils/getTokenFromHeader';
import HttpCodes from '../../../utils/HttpCodes';
import isAuthorized from '../../../utils/isAuthorized';

type AuthorizationType =
  | 'follow-user'
  | 'unfollow-user'
  | 'update-user'
  | 'fetch-user-feed';

const authorize = async (
  authorizationType: AuthorizationType,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (authorizationType === 'follow-user' || authorizationType === 'unfollow-user') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.body.thisUsername);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'update-user') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.body.username);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'fetch-user-feed') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.params.username);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  return res
    .status(HttpCodes.INTERNAL_SERVER_ERROR)
    .json(err('Unknown authorization type', HttpCodes.INTERNAL_SERVER_ERROR));
};

export default authorize;
