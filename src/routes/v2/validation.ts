import { NextFunction, Request, Response } from 'express';
import err from '../../utils/err';
import isValidFollowUserDto from '../../validation/followUser';
import isValidLoginDto from '../../validation/login';
import isValidRegisterDto from '../../validation/register';
import isValidResetPasswordDto from '../../validation/resetPassword';
import isValidSendPasswordResetEmailDto from '../../validation/sendPasswordResetEmail';
import isValidUnfollowUserDto from '../../validation/unfollowUser';
import isValidUpdateUserDto from '../../validation/updateUser';

type DtoType =
  | 'register'
  | 'login'
  | 'send-password-reset-email'
  | 'reset-password'
  | 'follow-user'
  | 'unfollow-user'
  | 'update-user';

// eslint-disable-next-line no-unused-vars
type ValidationFn = (_: object) => Promise<boolean>;

const matchDtoTypeToFunction: Record<DtoType, ValidationFn> = {
  register: isValidRegisterDto,
  login: isValidLoginDto,
  'send-password-reset-email': isValidSendPasswordResetEmailDto,
  'reset-password': isValidResetPasswordDto,
  'follow-user': isValidFollowUserDto,
  'unfollow-user': isValidUnfollowUserDto,
  'update-user': isValidUpdateUserDto,
};

const validateDto = async (dtoType: DtoType, req: Request, res: Response, next: NextFunction) => {
  const fn = matchDtoTypeToFunction[dtoType];

  const isValid = await fn(req.body);
  if (isValid) {
    return next();
  }

  return res.status(400).json(err('Request body is not valid', 400));
};

export default validateDto;
