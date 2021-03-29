import { Request, Response } from 'express';
import * as argon2 from 'argon2';

import { User } from '../../models/User';
import AuthService from '../../services/v2/AuthService';
import err from '../../utils/err';
import HttpCodes from '../../utils/HttpCodes';
import BaseController from './BaseController';
import RegisterDto from './dto/RegisterDto';
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
      password: await argon2.hash(dto.password),
    });

    const savedUser = await this.authService.createUser(user);

    if (savedUser) {
      return res.status(HttpCodes.CREATED)
        .json(response({ id: savedUser.id }));
    }

    return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
      .json(err('Server error: Cannot register', HttpCodes.INTERNAL_SERVER_ERROR));
  }
}

export default AuthController;
