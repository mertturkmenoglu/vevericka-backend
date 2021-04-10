import express from 'express';
import rateLimit from 'express-rate-limit';
import asyncHandler from 'express-async-handler';

import { Container } from 'typedi';
import validateDto from '../validateDto';
import AuthController from './AuthController';

const router = express.Router();

const authController = Container.get(AuthController);

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
