import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import err from '../utils/err';
import getTokenFromHeader from '../utils/getTokenFromHeader';
import HttpCodes from '../utils/HttpCodes';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(HttpCodes.UNAUTHORIZED).json(err('Invalid authotization token', HttpCodes.UNAUTHORIZED));
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!verified) {
      return res.status(HttpCodes.UNAUTHORIZED).json(err('Invalid authotization token', HttpCodes.UNAUTHORIZED));
    }

    return next();
  } catch (e) {
    console.log(e.message);
    return res.status(HttpCodes.UNAUTHORIZED).json(err('Invalid authotization token', HttpCodes.UNAUTHORIZED));
  }
};

export default isAuth;
