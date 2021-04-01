import { Request, Response } from 'express';
import PostService from './PostService';
import err from '../../../../utils/err';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import BaseController from '../../interfaces/BaseController';

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
    return res.json(response(post));
  }
}

export default PostController;
