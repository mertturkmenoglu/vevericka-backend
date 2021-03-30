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
import response from '../../utils/response';

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
}

export default AuthController;
