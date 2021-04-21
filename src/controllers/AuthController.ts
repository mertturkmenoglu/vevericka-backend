import {
  BadRequestError,
  InternalServerError,
  Body,
  HttpCode,
  JsonController,
  Post,
  Res,
  NotFoundError,
} from 'routing-controllers';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { Response } from 'express';
import RegisterDto from '../dto/RegisterDto';
import { User } from '../models/User';
import AuthService from '../services/AuthService';
import LoginDto from '../dto/LoginDto';
import SendPasswordResetEmailDto from '../dto/SendPasswordResetEmailDto';
import { redis } from '../redis';
import { FORGET_PASSWORD_PREFIX } from '../configs/RedisConfig';
import ResetPasswordDto from '../dto/ResetPasswordDto';

// // Rate limiters
// const rateLimiter = {
//   register: rateLimit({
//     windowMs: 1000 * 60, // 1 minute
//     max: 10,
//   }),
//   login: rateLimit({
//     windowMs: 1000 * 60, // 1 minute
//     max: 10,
//   }),
// };

@JsonController('/api/v2/auth')
@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    const userExists = await this.authService.userExists(dto.username, dto.email);

    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    const user = new User({
      username: dto.username,
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const savedUser = await user.save();

    if (savedUser) {
      return {
        id: savedUser.id,
      };
    }

    throw new InternalServerError('Server error: Cannot register');
  }

  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestError('Cannot login');
    }

    const isValidPassword = await argon2.verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new BadRequestError('Cannot login');
    }

    const payload = {
      userId: user.id,
      username: user.username,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '90d',
    });

    const bearer = `Bearer ${jwtToken}`;
    res.header('authorization', bearer);
    return res.json(payload);
  }

  @HttpCode(200)
  @Post('/send-password-reset-email')
  async sendPasswordResetEmail(@Body() dto: SendPasswordResetEmailDto) {
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const passwordResetCode = this.authService.generatePasswordResetCode();
    await redis.set(
      FORGET_PASSWORD_PREFIX + passwordResetCode,
      user.id,
      'ex',
      1000 * 60 * 60 * 3, // 3 hours
    );

    await this.authService.sendPasswordResetEmail(dto.email, passwordResetCode);
    return {
      message: 'Email sent',
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const user = await this.authService.getUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const REDIS_KEY = FORGET_PASSWORD_PREFIX + dto.code;
    const userId = await redis.get(REDIS_KEY);

    if (!userId) {
      throw new BadRequestError('Password reset code is invalid');
    }

    if (userId !== user.id) {
      throw new BadRequestError('Password reset code is invalid');
    }

    user.password = dto.password;

    await user.save();
    await redis.del(REDIS_KEY);

    return {
      message: 'Successful',
    };
  }
}

export default AuthController;
