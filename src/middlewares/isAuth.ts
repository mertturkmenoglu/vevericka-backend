import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import err from '../utils/err';
import getToken from '../utils/getToken';
import HttpCodes from '../utils/HttpCodes';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers || !req.headers.authorization) {
    return res.status(HttpCodes.UNAUTHORIZED).json(err('Not authorized', HttpCodes.UNAUTHORIZED));
  }

  const header = req.headers.authorization.toString();
  const token = getToken(header);

  if (!token) {
    return res.status(HttpCodes.UNAUTHORIZED).json(err('Invalid authotization token', HttpCodes.UNAUTHORIZED));
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!verified) {
    return res.status(HttpCodes.UNAUTHORIZED).json(err('Invalid authotization token', HttpCodes.UNAUTHORIZED));
  }

  return next();
};

export default isAuth;
