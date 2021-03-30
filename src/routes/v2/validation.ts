import { NextFunction, Request, Response } from 'express';
import err from '../../utils/err';
import isValidLoginDto from '../../validation/login';
import isValidRegisterDto from '../../validation/register';
import isValidSendPasswordResetEmailDto from '../../validation/sendPasswordResetEmail';

type DtoType = 'register' | 'login' | 'send-password-reset-email';

const validateDto = async (dtoType: DtoType, req: Request, res: Response, next: NextFunction) => {
  if (dtoType === 'register') {
    const isValid = await isValidRegisterDto(req.body);
    if (isValid) {
      return next();
    }

    return res.status(400).json(err('Request body is not valid', 400));
  }

  if (dtoType === 'login') {
    const isValid = await isValidLoginDto(req.body);
    if (isValid) {
      return next();
    }

    return res.status(400).json(err('Request body is not valid', 400));
  }

  if (dtoType === 'send-password-reset-email') {
    const isValid = await isValidSendPasswordResetEmailDto(req.body);
    if (isValid) {
      return next();
    }

    return res.status(400).json(err('Request body is not valid', 400));
  }

  return res.status(400).json(err('Unknown dto type', 400));
};

export default validateDto;
