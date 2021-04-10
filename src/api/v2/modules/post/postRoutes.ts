import express from 'express';
import { Container } from 'typedi';
import asyncHandler from 'express-async-handler';
import isAuth from '../../../../middlewares/isAuth';
import PostController from './PostController';
import authorize from '../authorization';
import validateDto from '../validateDto';

const router = express.Router();

const postController = Container.get(PostController);

router.get(
  '/:id',
  isAuth,
  asyncHandler(async (req, res) => postController.getPostById(req, res)),
);

router.get(
  '/user/:username',
  isAuth,
  asyncHandler(async (req, res) => postController.getUserPosts(req, res)),
);

router.get(
  '/feed/:username',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('fetch-user-feed', req, res, next)),
  asyncHandler(async (req, res) => postController.getUserFeed(req, res)),
);

router.post(
  '/',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('create-post', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('create-post', req, res, next)),
  asyncHandler(async (req, res) => postController.createPost(req, res)),
);

router.delete(
  '/:id',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('delete-post', req, res, next)),
  asyncHandler(async (req, res) => postController.deletePost(req, res)),
);

router.delete(
  '/comment/:id',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('delete-comment', req, res, next)),
  asyncHandler(async (req, res) => postController.deleteComment(req, res)),
);

router.get(
  '/comment/:id',
  isAuth,
  asyncHandler(async (req, res) => postController.getCommentById(req, res)),
);

router.post(
  '/comment/',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('create-comment', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('create-comment', req, res, next)),
  asyncHandler(async (req, res) => postController.createComment(req, res)),
);

router.get(
  '/bookmark/:id',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('get-bookmark', req, res, next)),
  asyncHandler(async (req, res) => postController.getBookmarkById(req, res)),
);

router.get(
  '/bookmark/user/:username',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('get-user-bookmarks', req, res, next)),
  asyncHandler(async (req, res) => postController.getUserBookmarks(req, res)),
);

router.delete(
  '/bookmark/:id',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('delete-bookmark', req, res, next)),
  asyncHandler(async (req, res) => postController.deleteBookmark(req, res)),
);

router.post(
  '/bookmark/',
  isAuth,
  asyncHandler(async (req, res, next) => authorize('create-bookmark', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('create-bookmark', req, res, next)),
  asyncHandler(async (req, res) => postController.createBookmark(req, res)),
);

export default router;
