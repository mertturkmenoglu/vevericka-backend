import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

  async getPostById(id: number): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return null;
    }

    return post;
  }

  async createPost(dto: CreatePostDto): Promise<Post | null> {
    const { data: user, exception } = await this.userService.getUserByUsername(dto.username);

    if (!user) {
      throw exception;
    }

    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return post;
  }

  async getPostsByUsername(
    username: string,
    page: number,
    pageSize: number,
  ): Promise<[posts: Omit<Post, 'user'>[], totalRecords: number]> {
    const posts = await this.prisma.post.findMany({
      where: {
        user: {
          username,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip: pageSize * (page - 1),
      take: pageSize,
      include: {
        likes: {
          select: {
            _count: true,
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        dislikes: true,
      },
    });

    const totalRecords = await this.prisma.post.count({
      where: {
        user: {
          username,
        },
      },
    });

    return [posts, totalRecords];
  }
}
