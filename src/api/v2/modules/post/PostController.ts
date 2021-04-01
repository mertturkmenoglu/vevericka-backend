import { Request, Response } from 'express';
import PostService from './PostService';
import err from '../../../../utils/err';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import BaseController from '../../interfaces/BaseController';
import { User } from '../../../../models/User';

class PostController extends BaseController {
  constructor(readonly postService: PostService) {
    super();
    this.postService = postService;
  }

  async getPostById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid post id', HttpCodes.BAD_REQUEST));
    }

    const post = await this.postService.getPostById(id);

    if (!post) {
      return res.status(HttpCodes.NOT_FOUND).json(err('Post not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(post));
  }

  async getUserPosts(req: Request, res: Response) {
    const { username } = req.params;

    if (!username) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid username', HttpCodes.BAD_REQUEST));
    }

    const user = User.findOne({ username });

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    const posts = await this.postService.getUserPosts(username);
    return res.json(response(posts));
  }
}

export default PostController;
