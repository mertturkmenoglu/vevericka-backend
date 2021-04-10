import { NextFunction, Request, Response } from 'express';
import err from './err';
import HttpCodes from './HttpCodes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (e: Error, _req: Request, res: Response, _next: NextFunction) => {
  let code;
  if (e.name === 'BadRequestError') {
    code = HttpCodes.BAD_REQUEST;
  } else if (e.name === 'UnauthorizedError') {
    code = HttpCodes.UNAUTHORIZED;
  } else if (e.name === 'NotFoundError') {
    code = HttpCodes.NOT_FOUND;
  } else if (e.name === 'InternalServerError') {
    code = HttpCodes.INTERNAL_SERVER_ERROR;
  } else {
    code = HttpCodes.SERVICE_UNAVAILABLE;
  }

  return res.status(code).json(err(e.message, code));
};

export default errorHandler;
