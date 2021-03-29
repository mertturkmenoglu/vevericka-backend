import express, { NextFunction, Request, Response } from 'express';

import AuthController from '../../controllers/v2/AuthController';
import AuthService from '../../services/v2/AuthService';
import validateDto from './validation';

const router = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) => validateDto('register', req, res, next),
  (req: Request, res: Response) => authController.register(req, res),
);

export default router;
