import { NextFunction, Request, Response } from 'express';
import BadRequest from '../../../errors/BadRequest';
import { DtoType } from '../types';
import validation from '../validation';

const validateDto = async (dtoType: DtoType, req: Request, _res: Response, next: NextFunction) => {
  const fn = validation[dtoType];
  const isValid = await fn(req.body);

  if (!isValid) {
    return next(new BadRequest('Request body is invalid'));
  }

  return next();
};

export default validateDto;
