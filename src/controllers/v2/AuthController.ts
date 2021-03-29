import { Request, Response } from 'express';
import AuthService from '../../services/v2/AuthService';
import err from '../../utils/err';
import BaseController from './BaseController';

class AuthController extends BaseController {
  authService: AuthService

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  register(req: Request, res: Response) {
    console.log(this.authService);
    console.log(req.body);
    return res.status(501).json(err('Not implemented', 501));
  }
}

export default AuthController;
