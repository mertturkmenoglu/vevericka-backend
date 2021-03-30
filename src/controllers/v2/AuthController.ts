import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import { User } from '../../models/User';
import AuthService from '../../services/v2/AuthService';
import err from '../../utils/err';
import HttpCodes from '../../utils/HttpCodes';
import BaseController from './BaseController';
import RegisterDto from './dto/RegisterDto';
import LoginDto from './dto/LoginDto';
import SendPasswordResetEmailDto from './dto/SendPasswordResetEmailDto';
import ResetPasswordDto from './dto/ResetPasswordDto';
import response from '../../utils/response';
import app from '../../index';
import { FORGET_PASSWORD_PREFIX } from '../../configs/RedisConfig';
import logger from '../../utils/winstonLogger';

class AuthController extends BaseController {
  authService: AuthService

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  async register(req: Request, res: Response) {
    const dto = req.body as RegisterDto;
    const userExists = await this.authService.userExists(dto.username, dto.email);

    if (userExists) {
      return res.status(HttpCodes.BAD_REQUEST)
        .json(err('User already exists', HttpCodes.BAD_REQUEST));
    }

    const user = new User({
      username: dto.username,
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const savedUser = await this.authService.createUser(user);

    if (savedUser) {
      return res.status(HttpCodes.CREATED)
        .json(response({ id: savedUser.id }));
    }

    return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
      .json(err('Server error: Cannot register', HttpCodes.INTERNAL_SERVER_ERROR));
  }

  async login(req: Request, res: Response) {
    const dto = req.body as LoginDto;
    const user = await this.authService.getUserByEmail(dto.email);
    console.log('login user', user);

    if (!user) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Cannot login', HttpCodes.BAD_REQUEST));
    }

    try {
      const isValid = await argon2.verify(user.password, dto.password);

      if (!isValid) {
        return res.status(HttpCodes.BAD_REQUEST).json(err('Cannot login', HttpCodes.BAD_REQUEST));
      }

      const payload = { userId: user.id };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
      });

      const bearer = `Bearer ${jwtToken}`;

      return res
        .header('Authorization', bearer)
        .status(HttpCodes.OK)
        .end();
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(err('Login operation failed', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  async sendPasswordResetEmail(req: Request, res: Response) {
    const dto = req.body as SendPasswordResetEmailDto;
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      return res.status(HttpCodes.OK).end();
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

  async resetPassword(req: Request, res: Response) {
    const dto = req.body as ResetPasswordDto;
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('User does not exist', HttpCodes.BAD_REQUEST));
    }

    const REDIS_KEY = FORGET_PASSWORD_PREFIX + dto.code;
    const userId = await app.redis.get(REDIS_KEY);

    if (!userId) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Password reset code is invalid', HttpCodes.BAD_REQUEST));
    }

    if (userId !== user.id) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Password reset code is invalid', HttpCodes.BAD_REQUEST));
    }

    user.password = dto.password;

    try {
      await user.save();
      await app.redis.del(REDIS_KEY);
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      logger.error(e);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot reset password', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }
}

export default AuthController;
