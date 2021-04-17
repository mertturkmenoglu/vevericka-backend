import {
  Authorized,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
  UseBefore,
  UseInterceptor,
} from 'routing-controllers';
import { Service } from 'typedi';
import IsAuth from '../middlewares/IsAuth';
import PostService from '../services/PostService';
import { Role } from '../role';
import { User } from '../models/User';
import { Post as PostModel } from '../models/Post';
import CreatePostDto from '../dto/CreatePostDto';
import { DocumentToJsonInterceptor } from '../interceptors/DocumentToJsonInterceptor';

@JsonController('/api/v2/post')
@UseInterceptor(DocumentToJsonInterceptor)
@Service()
class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:id')
  @UseBefore(IsAuth)
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  }

  @Get('/user/:username')
  @UseBefore(IsAuth)
  async getUserPosts(@Param('username') username: string) {
    const user = await this.findUserByUsername(username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.postService.getUserPosts(user.id);
  }

  @Get('/feed/:username')
  @UseBefore(IsAuth)
  @Authorized(Role.FETCH_USER_FEED)
  async getUserFeed(@Param('username') username: string) {
    const user = await this.findUserByUsername(username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.postService.getUserFeed(user);
  }

  @HttpCode(201)
  @Post('/')
  @UseBefore(IsAuth)
  @Authorized(Role.CREATE_POST)
  async createPost(@Body() dto: CreatePostDto) {
    const post = new PostModel({
      createdBy: dto.createdBy,
      content: dto.content,
      comments: [],
    });

    return post.save();
  }

  @HttpCode(204)
  @Delete('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.DELETE_POST)
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
    return {
      message: 'deleted',
    };
  }

  private findUserByUsername = async (username?: string) => {
    if (!username) {
      return null;
    }

    const user = await User.findOne({ username });

    if (!user) {
      return null;
    }

    return user;
  };
}

export default PostController;
