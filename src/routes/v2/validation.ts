import { NextFunction, Request, Response } from 'express';
import err from '../../utils/err';
import isValidFollowUserDto from '../../validation/followUser';
import isValidLoginDto from '../../validation/login';
import isValidRegisterDto from '../../validation/register';
import isValidResetPasswordDto from '../../validation/resetPassword';
import isValidSendPasswordResetEmailDto from '../../validation/sendPasswordResetEmail';
import isValidUnfollowUserDto from '../../validation/unfollowUser';

type DtoType = 'register' | 'login' | 'send-password-reset-email'
  | 'reset-password' | 'follow-user' | 'unfollow-user';

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

  if (dtoType === 'reset-password') {
    const isValid = await isValidResetPasswordDto(req.body);
    if (isValid) {
      return next();
    }

    return res.status(400).json(err('Request body is not valid', 400));
  }

  if (dtoType === 'follow-user') {
    const isValid = await isValidFollowUserDto(req.body);
    if (isValid) {
      return next();
    }

    return res.status(400).json(err('Request body is not valid', 400));
  }

  if (dtoType === 'unfollow-user') {
    const isValid = await isValidUnfollowUserDto(req.body);
    if (isValid) {
      return next();
    }

    return res.status(400).json(err('Request body is not valid', 400));
  }

  return res.status(400).json(err('Unknown dto type', 400));
};

export default validateDto;
