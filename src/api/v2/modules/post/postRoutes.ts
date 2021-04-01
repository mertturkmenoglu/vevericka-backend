import express from 'express';
import isAuth from '../../../../middlewares/isAuth';
import PostController from './PostController';
import PostRepository from './PostRepository';
import PostService from './PostService';
import authorize from '../authorization';
import validateDto from '../validation';

const router = express.Router();

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

router.get(
  '/:id',
  isAuth,
  (req, res) => postController.getPostById(req, res),
);

router.get(
  '/user/:username',
  isAuth,
  (req, res) => postController.getUserPosts(req, res),
);

router.get(
  '/feed/:username',
  isAuth,
  (req, res, next) => authorize('fetch-user-feed', req, res, next),
  (req, res) => postController.getUserFeed(req, res),
);

router.post(
  '/',
  isAuth,
  (req, res, next) => authorize('create-post', req, res, next),
  (req, res, next) => validateDto('create-post', req, res, next),
  (req, res) => postController.createPost(req, res),
);

export default router;
