import { Request, Response } from 'express';
import AuthService from '../../services/v2/AuthService';
import err from '../../utils/err';
import BaseController from './BaseController';
import RegisterDto from './dto/RegisterDto';

class AuthController extends BaseController {
  authService: AuthService

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  register(req: Request, res: Response) {
    const dto = req.body as RegisterDto;
    console.log(this.authService);
    console.log('Register dto', dto);

    return res.status(501).json(err('Not implemented', 501));
  }
}

export default AuthController;
