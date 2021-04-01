import { NextFunction, Request, Response } from 'express';
import err from '../../../utils/err';
import isValidFollowUserDto from './auth/validation/followUser';
import isValidLoginDto from './auth/validation/login';
import isValidRegisterDto from './auth/validation/register';
import isValidResetPasswordDto from './auth/validation/resetPassword';
import isValidSendPasswordResetEmailDto from './auth/validation/sendPasswordResetEmail';
import isValidUnfollowUserDto from './user/validation/unfollowUser';
import isValidUpdateUserDto from './user/validation/updateUser';

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
