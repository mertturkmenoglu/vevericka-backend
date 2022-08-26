import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post as PostMapping,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { Comment, Post } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MinimalUserResponse } from 'src/types/MinimalUserResponse';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { RequestUser } from 'src/user/types/request-user.type';
import { User } from 'src/user/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { LikeStatus } from './types/like-status.enum';
import { SinglePost } from './types/single-post.type';
import { Cache } from 'cache-manager';

@ApiTags('post')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'post',
})
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @User() { user }: RequestUser,
  ): Promise<SinglePost> {
    const { data, exception } = await this.postService.getPostById(id, user.username);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deletePostById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const { data, exception } = await this.postService.deletePostById(id);

    if (!data) {
      throw exception;
    }
  }

  @PostMapping('/')
  async createPost(@Body() dto: CreatePostDto): Promise<SinglePost> {
    const { data, exception } = await this.postService.createPost(dto);

    if (!data) {
      throw exception;
    }

    await this.cacheManager.reset();
    return data;
  }

  @Get('/user/:username/posts')
  async getPostsByUsername(
    @Param('username') username: string,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginatedResults<Omit<Post, 'user'>[]>> {
    const [posts, totalRecords] = await this.postService.getPostsByUsername(
      username,
      paginationQuery,
    );

    if (!posts) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    return {
      data: posts,
      pagination: paginationQuery.getPaginationMeta(totalRecords),
    };
  }

  @Get('/user/:username/feed')
  async getFeedByUsername(
    @Param('username') username: string,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginatedResults<Post[]>> {
    const { data, exception } = await this.postService.getFeedByUsername(username, paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:id/like')
  @HttpCode(204)
  async likePost(
    @Param('id', ParseIntPipe) postId: number,
    @User() { user }: RequestUser,
  ): Promise<void> {
    const { data, exception } = await this.postService.changeLikeStatus(
      postId,
      user.username,
      LikeStatus.LIKED,
    );

    if (!data) {
      throw exception;
    }

    await this.cacheManager.reset();
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:id/dislike')
  @HttpCode(204)
  async dislikePost(
    @Param('id', ParseIntPipe) postId: number,
    @User() { user }: RequestUser,
  ): Promise<void> {
    const { data, exception } = await this.postService.changeLikeStatus(
      postId,
      user.username,
      LikeStatus.DISLIKED,
    );

    if (!data) {
      throw exception;
    }

    await this.cacheManager.reset();
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:id/like-none')
  @HttpCode(204)
  async likeNone(
    @Param('id', ParseIntPipe) postId: number,
    @User() { user }: RequestUser,
  ): Promise<void> {
    const { data, exception } = await this.postService.changeLikeStatus(
      postId,
      user.username,
      LikeStatus.NONE,
    );

    if (!data) {
      throw exception;
    }

    await this.cacheManager.reset();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/likes')
  async getLikes(
    @Param('id', ParseIntPipe) postId: number,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginatedResults<MinimalUserResponse[]>> {
    const { data, exception } = await this.postService.getLikes(postId, paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/dislikes')
  async getDislikes(
    @Param('id', ParseIntPipe) postId: number,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginatedResults<MinimalUserResponse[]>> {
    const { data, exception } = await this.postService.getDislikes(postId, paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/comments')
  async getPostComments(
    @Param('id', ParseIntPipe) postId: number,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginatedResults<Comment[]>> {
    const { data, exception } = await this.postService.getPostComments(postId, paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:id/comment/')
  @HttpCode(201)
  async createComment(
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
  ): Promise<Comment> {
    const { data, exception } = await this.postService.createComment(postId, dto);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:commentId')
  @HttpCode(204)
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    const { data, exception } = await this.postService.deleteComment(commentId);

    if (!data) {
      throw exception;
    }
  }
}
