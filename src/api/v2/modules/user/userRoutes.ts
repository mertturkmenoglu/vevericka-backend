import express from 'express';
import { Container } from 'typedi';
import asyncHandler from 'express-async-handler';
import UserController from './UserController';
import isAuth from '../../../../middlewares/isAuth';

import authorize from '../authorization';
import validateDto from '../validateDto';

const router = express.Router();
const userController = Container.get(UserController);

router.get(
  '/q',
  isAuth,
  asyncHandler(async (req, res) => userController.searchUsersByQuery(req, res)),
);

router.get(
  '/username/:username',
  isAuth,
  asyncHandler(async (req, res) => userController.getUserByUsername(req, res)),
);

router.get(
  '/:id',
  isAuth,
  asyncHandler(async (req, res) => userController.getUserById(req, res)),
);

router.post(
  '/follow',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('follow-user', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('follow-user', req, res, next)),
  asyncHandler(async (req, res) => userController.followUser(req, res)),
);

router.post(
  '/unfollow',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('unfollow-user', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('unfollow-user', req, res, next)),
  asyncHandler(async (req, res) => userController.unfollowUser(req, res)),
);

router.put(
  '/',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('update-user', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('update-user', req, res, next)),
  asyncHandler(async (req, res) => userController.updateUser(req, res)),
);

export default router;
