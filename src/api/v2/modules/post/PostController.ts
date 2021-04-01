import { Request, Response } from 'express';
import PostService from './PostService';
import err from '../../../../utils/err';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import BaseController from '../../interfaces/BaseController';
import { User } from '../../../../models/User';
import CreatePostDto from './dto/CreatePostDto';
import { Post } from '../../../../models/Post';

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

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    const posts = await this.postService.getUserPosts(username);
    return res.json(response(posts));
  }

  async getUserFeed(req: Request, res: Response) {
    const { username } = req.params;

    if (!username) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid username', HttpCodes.BAD_REQUEST));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    const feed = await this.postService.getUserFeed(user);
    return res.json(response(feed));
  }

  // eslint-disable-next-line class-methods-use-this
  async createPost(req: Request, res: Response) {
    const dto = req.body as CreatePostDto;

    const post = new Post({
      createdBy: dto.createdBy,
      content: dto.content,
      comments: [],
    });

    try {
      const savedPost = await post.save();
      return res.status(HttpCodes.CREATED).json(response(savedPost));
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot create post', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }
}

export default PostController;
