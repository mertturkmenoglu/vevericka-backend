import express from 'express';
import isAuth from '../../../../middlewares/isAuth';
import PostController from './PostController';
import PostRepository from './PostRepository';
import PostService from './PostService';

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

export default router;
