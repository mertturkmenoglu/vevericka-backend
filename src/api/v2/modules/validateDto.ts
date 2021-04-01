import { NextFunction, Request, Response } from 'express';
import err from '../../../utils/err';
import HttpCodes from '../../../utils/HttpCodes';
import { DtoType } from '../types';
import validation from '../validation';

const validateDto = async (dtoType: DtoType, req: Request, res: Response, next: NextFunction) => {
  const fn = validation[dtoType];

  const isValid = await fn(req.body);
  if (isValid) {
    return next();
  }

  return res.status(HttpCodes.BAD_REQUEST).json(err('Request body is not valid', HttpCodes.BAD_REQUEST));
};

export default validateDto;
