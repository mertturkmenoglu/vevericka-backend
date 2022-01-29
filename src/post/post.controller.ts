import { Body, Controller, Get, NotFoundException, Param, Post as PostRoute, Query } from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@ApiTags('post')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'post',
})
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<Post> {
    const post = await this.postService.getPostById(id);

    if (!post) {
      throw new NotFoundException(`Post not found: ${id}`);
    }

    return post;
  }

  @PostRoute('/')
  async createPost(@Body() dto: CreatePostDto): Promise<Post> {
    const saved = await this.postService.createPost(dto);

    if (!saved) {
      throw new NotFoundException(`User not found: ${dto.username}`);
    }
    return saved;
  }

  @Get('/user/:username')
  async getPostsByUsername(
    @Param('username') username: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<PaginatedResults<Omit<Post, 'user'>[]>> {
    const [posts, totalRecords] = await this.postService.getPostsByUsername(username, page, pageSize);

    if (!posts) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    return {
      data: posts,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalRecords: totalRecords,
        totalPages: Math.floor(totalRecords / pageSize),
      },
    };
  }
}
