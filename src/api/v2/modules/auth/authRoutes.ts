import express from 'express';
import rateLimit from 'express-rate-limit';
import asyncHandler from 'express-async-handler';

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
  asyncHandler(async (req, res, next) => validateDto('register', req, res, next)),
  asyncHandler(async (req, res) => authController.register(req, res)),
);

router.post(
  '/login',
  rateLimiter.login,
  asyncHandler(async (req, res, next) => validateDto('login', req, res, next)),
  asyncHandler(async (req, res) => authController.login(req, res)),
);

router.post(
  '/send-password-reset-email',
  asyncHandler(async (req, res, next) => validateDto('send-password-reset-email', req, res, next)),
  asyncHandler(async (req, res) => authController.sendPasswordResetEmail(req, res)),
);

router.post(
  '/reset-password',
  asyncHandler(async (req, res, next) => validateDto('reset-password', req, res, next)),
  asyncHandler(async (req, res) => authController.resetPassword(req, res)),
);

export default router;
