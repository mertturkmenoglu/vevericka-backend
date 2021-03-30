import express, { NextFunction, Request, Response } from 'express';

import AuthController from '../../controllers/v2/AuthController';
import UserRepository from '../../repositories/UserRepository';
import AuthService from '../../services/v2/AuthService';
import validateDto from './validation';
import logger from '../../utils/winstonLogger';

const router = express.Router();

const userRepository = new UserRepository(logger);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) => validateDto('register', req, res, next),
  (req: Request, res: Response) => authController.register(req, res),
);

router.post(
  '/login',
  (req: Request, res: Response, next: NextFunction) => validateDto('login', req, res, next),
  (req: Request, res: Response) => authController.login(req, res),
);

router.post(
  '/send-password-reset-email',
  (req: Request, res: Response, next: NextFunction) => validateDto('send-password-reset-email', req, res, next),
  (req: Request, res: Response) => authController.sendPasswordResetEmail(req, res),
);

export default router;
