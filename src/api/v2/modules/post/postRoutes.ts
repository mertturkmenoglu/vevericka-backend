import express from 'express';
import { Container } from 'typedi';
import asyncHandler from 'express-async-handler';
import IsAuth from '../../../../middlewares/IsAuth';
import PostController from './PostController';

const router = express.Router();

const postController = Container.get(PostController);

router.delete(
  '/comment/:id',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('delete-comment', req, res, next)),
  asyncHandler(async (req, res) => postController.deleteComment(req, res)),
);

router.get(
  '/comment/:id',
  IsAuth,
  asyncHandler(async (req, res) => postController.getCommentById(req, res)),
);

router.post(
  '/comment/',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('create-comment', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('create-comment', req, res, next)),
  asyncHandler(async (req, res) => postController.createComment(req, res)),
);

export default router;
