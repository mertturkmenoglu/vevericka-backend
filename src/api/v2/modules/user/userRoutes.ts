import express, { NextFunction, Request, Response } from 'express';
import UserController from './UserController';
import isAuth from '../../../../middlewares/isAuth';
import UserRepository from './UserRepository';
import UserService from './UserService';
import logger from '../../../../utils/winstonLogger';
import authorize from '../authorization';
import validateDto from '../validateDto';

const router = express.Router();

const userRepository = new UserRepository(logger);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get(
  '/q',
  isAuth,
  (req, res) => userController.searchUsersByQuery(req, res),
);

router.get(
  '/username/:username',
  isAuth,
  (req: Request, res: Response) => userController.getUserByUsername(req, res),
);

router.get(
  '/:id',
  isAuth,
  (req: Request, res: Response) => userController.getUserById(req, res),
);

router.post(
  '/follow',
  isAuth,
  (req, res, next) => authorize('follow-user', req, res, next),
  (req: Request, res: Response, next: NextFunction) => validateDto('follow-user', req, res, next),
  (req: Request, res: Response) => userController.followUser(req, res),
);

router.post(
  '/unfollow',
  isAuth,
  (req, res, next) => authorize('unfollow-user', req, res, next),
  (req: Request, res: Response, next: NextFunction) => validateDto('unfollow-user', req, res, next),
  (req: Request, res: Response) => userController.unfollowUser(req, res),
);

router.put(
  '/',
  isAuth,
  (req, res, next) => authorize('update-user', req, res, next),
  (req, res, next) => validateDto('update-user', req, res, next),
  (req, res) => userController.updateUser(req, res),
);

export default router;
