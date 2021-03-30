import express, { NextFunction, Request, Response } from 'express';
import UserController from '../../controllers/v2/UserController';
import isAuth from '../../middlewares/isAuth';
import UserRepository from '../../repositories/UserRepository';
import UserService from '../../services/v2/UserService';
import logger from '../../utils/winstonLogger';
import authorize from './authorization';
import validateDto from './validation';

const router = express.Router();

const userRepository = new UserRepository(logger);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/username/:username', (req: Request, res: Response) => userController.getUserByUsername(req, res));

router.get('/:id', (req: Request, res: Response) => userController.getUserById(req, res));

router.post(
  '/follow',
  isAuth,
  (req, res, next) => authorize('follow-user', req, res, next),
  (req: Request, res: Response, next: NextFunction) => validateDto('follow-user', req, res, next),
  (req: Request, res: Response) => userController.followUser(req, res),
);

export default router;
