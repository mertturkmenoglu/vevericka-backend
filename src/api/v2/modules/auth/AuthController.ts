import { NextFunction, Request, Response } from 'express';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import { User } from '../../../../models/User';
import AuthService from './AuthService';
import HttpCodes from '../../../../utils/HttpCodes';
import BaseController from '../../interfaces/BaseController';
import RegisterDto from './dto/RegisterDto';
import LoginDto from './dto/LoginDto';
import SendPasswordResetEmailDto from './dto/SendPasswordResetEmailDto';
import ResetPasswordDto from './dto/ResetPasswordDto';
import response from '../../../../utils/response';
import app from '../../../../index';
import { FORGET_PASSWORD_PREFIX } from '../../../../configs/RedisConfig';
import logger from '../../../../utils/winstonLogger';
import BadRequest from '../../../../errors/BadRequest';
import InternalServerError from '../../../../errors/InternalServerError';
import NotFound from '../../../../errors/NotFound';

class AuthController extends BaseController {
  authService: AuthService

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as RegisterDto;
    const userExists = await this.authService.userExists(dto.username, dto.email);

    if (userExists) {
      return next(new BadRequest('User already exists'));
    }

    const user = new User({
      username: dto.username,
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const savedUser = await this.authService.createUser(user);

    if (savedUser) {
      return res
        .status(HttpCodes.CREATED)
        .json(response({ id: savedUser.id }));
    }

    return next(new InternalServerError('Server error: Cannot register'));
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as LoginDto;
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      return next(new BadRequest('Cannot login'));
    }

    try {
      const isValid = await argon2.verify(user.password, dto.password);

      if (!isValid) {
        return next(new BadRequest('Cannot login'));
      }

      const payload = {
        userId: user.id,
        username: user.username,
      };

      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
      });

      const bearer = `Bearer ${jwtToken}`;

      return res
        .header('Authorization', bearer)
        .status(HttpCodes.OK)
        .end();
    } catch (e) {
      return next(new InternalServerError('Server error: Login failed'));
    }
  }

  async sendPasswordResetEmail(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as SendPasswordResetEmailDto;
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      return next(new NotFound('User does not exist'));
    }

    const passwordResetCode = this.authService.generatePasswordResetCode();
    await app.redis.set(
      FORGET_PASSWORD_PREFIX + passwordResetCode,
      user.id,
      'ex',
      1000 * 60 * 60 * 3, // 3 hours
    );

    await this.authService.sendPasswordResetEmail(dto.email, passwordResetCode);
    return res.status(HttpCodes.OK).end();
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as ResetPasswordDto;
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      return next(new BadRequest('User does not exist'));
    }

    const REDIS_KEY = FORGET_PASSWORD_PREFIX + dto.code;
    const userId = await app.redis.get(REDIS_KEY);

    if (!userId) {
      return next(new BadRequest('Password reset code is invalid'));
    }

    if (userId !== user.id) {
      return next(new BadRequest('Password reset code is invalid'));
    }

    user.password = dto.password;

    try {
      await user.save();
      await app.redis.del(REDIS_KEY);
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      logger.error(e);
      return next(new InternalServerError('Server error: Cannot reset password'));
    }
  }
}

export default AuthController;
