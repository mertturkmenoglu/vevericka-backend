import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post as PostMapping,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MinimalUserResponse } from 'src/types/MinimalUserResponse';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { RequestUser } from 'src/user/types/request-user.type';
import { User } from 'src/user/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { LikeStatus } from './types/like-status.enum';
import { SinglePost } from './types/single-post.type';

@ApiTags('post')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'post',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: RequestUser,
  ): Promise<SinglePost> {
    const { data, exception } = await this.postService.getPostById(id, user.username);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @PostMapping('/')
  async createPost(@Body() dto: CreatePostDto): Promise<SinglePost> {
    const { data, exception } = await this.postService.createPost(dto);

    if (!data) {
      throw exception;
    }

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
    @User() user: RequestUser,
  ): Promise<void> {
    const { data, exception } = await this.postService.changeLikeStatus(
      postId,
      user.username,
      LikeStatus.LIKED,
    );

    if (!data) {
      throw exception;
    }
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:id/dislike')
  @HttpCode(204)
  async dislikePost(
    @Param('id', ParseIntPipe) postId: number,
    @User() user: RequestUser,
  ): Promise<void> {
    const { data, exception } = await this.postService.changeLikeStatus(
      postId,
      user.username,
      LikeStatus.DISLIKED,
    );

    if (!data) {
      throw exception;
    }
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:id/like-none')
  @HttpCode(204)
  async likeNone(
    @Param('id', ParseIntPipe) postId: number,
    @User() user: RequestUser,
  ): Promise<void> {
    const { data, exception } = await this.postService.changeLikeStatus(
      postId,
      user.username,
      LikeStatus.NONE,
    );

    if (!data) {
      throw exception;
    }
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
}
