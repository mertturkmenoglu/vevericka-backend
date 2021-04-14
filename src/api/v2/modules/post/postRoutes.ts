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

router.get(
  '/bookmark/:id',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('get-bookmark', req, res, next)),
  asyncHandler(async (req, res) => postController.getBookmarkById(req, res)),
);

router.get(
  '/bookmark/user/:username',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('get-user-bookmarks', req, res, next)),
  asyncHandler(async (req, res) => postController.getUserBookmarks(req, res)),
);

router.delete(
  '/bookmark/:id',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('delete-bookmark', req, res, next)),
  asyncHandler(async (req, res) => postController.deleteBookmark(req, res)),
);

router.post(
  '/bookmark/',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('create-bookmark', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('create-bookmark', req, res, next)),
  asyncHandler(async (req, res) => postController.createBookmark(req, res)),
);

export default router;
