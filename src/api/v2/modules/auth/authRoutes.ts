import express from 'express';
import rateLimit from 'express-rate-limit';

import AuthController from './AuthController';
import UserRepository from '../user/UserRepository';
import AuthService from './AuthService';
import validateDto from '../validateDto';
import logger from '../../../../utils/winstonLogger';

const router = express.Router();

const userRepository = new UserRepository(logger);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Rate limiters
const rateLimiter = {
  register: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 10,
  }),
  login: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 10,
  }),
};

router.post(
  '/register',
  rateLimiter.register,
  (req, res, next) => validateDto('register', req, res, next),
  (req, res, next) => authController.register(req, res, next),
);

router.post(
  '/login',
  rateLimiter.login,
  (req, res, next) => validateDto('login', req, res, next),
  (req, res, next) => authController.login(req, res, next),
);

router.post(
  '/send-password-reset-email',
  (req, res, next) => validateDto('send-password-reset-email', req, res, next),
  (req, res, next) => authController.sendPasswordResetEmail(req, res, next),
);

router.post(
  '/reset-password',
  (req, res, next) => validateDto('reset-password', req, res, next),
  (req, res, next) => authController.resetPassword(req, res, next),
);

export default router;
