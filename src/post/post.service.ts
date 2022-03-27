import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { SinglePost } from './types/single-post.type';
import { AsyncResult } from 'src/types/AsyncResult';
import { LikeStatus } from './types/like-status.enum';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { MinimalUserResponse } from 'src/types/MinimalUserResponse';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

  async getPostById(id: number, thisUsername: string): AsyncResult<SinglePost> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            verified: true,
            protected: true,
          },
        },
        _count: {
          select: {
            comments: true,
            dislikes: true,
            likes: true,
            tags: true,
          },
        },
      },
    });

    const likeQueryResult = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        likes: {
          where: {
            username: thisUsername,
          },
        },
        dislikes: {
          where: {
            username: thisUsername,
          },
        },
      },
    });

    if (!likeQueryResult) {
      return {
        exception: new HttpException('Cannot get post: Request user is not valid', 400),
      };
    }

    const likeMapping = {
      like: likeQueryResult.likes.length > 0,
      dislike: likeQueryResult.dislikes.length > 0,
    };

    // eslint-disable-next-line prettier/prettier
    const likeStatus = likeMapping.like ? LikeStatus.LIKED : (likeMapping.dislike ? LikeStatus.DISLIKED : LikeStatus.NONE);

    if (!post) {
      return {
        exception: new HttpException('Cannot get post', 400),
      };
    }

    const { _count: count, ...rest } = post;

    const singlePost: SinglePost = {
      ...rest,
      commentsCount: count.comments,
      dislikesCount: count.dislikes,
      tagsCount: count.tags,
      likesCount: count.likes,
      likeStatus,
    };

    return {
      data: singlePost,
    };
  }

  async createPost(dto: CreatePostDto): AsyncResult<SinglePost> {
    const { data: user, exception } = await this.userService.getUserByUsername(dto.username);

    if (!user) {
      return {
        exception,
      };
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
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            verified: true,
            protected: true,
          },
        },
        _count: {
          select: {
            comments: true,
            dislikes: true,
            likes: true,
            tags: true,
          },
        },
      },
    });

    const { _count: count, ...rest } = post;

    return {
      data: {
        ...rest,
        commentsCount: count.comments,
        dislikesCount: count.dislikes,
        tagsCount: count.tags,
        likesCount: count.likes,
        likeStatus: LikeStatus.NONE,
      },
    };
  }

  async getPostsByUsername(
    username: string,
    paginationQuery: PaginationQuery,
  ): Promise<[posts: Omit<Post, 'user'>[], totalRecords: number]> {
    const [posts, totalRecords] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: {
          user: {
            username,
          },
        },
        orderBy: {
          createdAt: paginationQuery.order,
        },
        skip: paginationQuery.pageSize * (paginationQuery.page - 1),
        take: paginationQuery.pageSize,
        include: {
          _count: {
            select: {
              comments: true,
              dislikes: true,
              likes: true,
              tags: true,
            },
          },
        },
      }),
      this.prisma.post.count({
        where: {
          user: {
            username,
          },
        },
      }),
    ]);

    return [posts, totalRecords];
  }

  async getFeedByUsername(
    username: string,
    paginationQuery: PaginationQuery,
  ): AsyncResult<PaginatedResults<Post[]>> {
    const followingQueryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        following: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!followingQueryResult) {
      return {
        exception: new HttpException('Cannot get feed', 400),
      };
    }

    const { following } = followingQueryResult;
    following.push({ username });

    const [feed, totalRecords] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: {
          user: {
            username: {
              in: [...following.map((u) => u.username)],
            },
          },
        },
        orderBy: {
          createdAt: paginationQuery.order,
        },
        skip: paginationQuery.pageSize * (paginationQuery.page - 1),
        take: paginationQuery.pageSize,
        include: {
          _count: {
            select: {
              comments: true,
              dislikes: true,
              likes: true,
              tags: true,
            },
          },
          user: {
            select: {
              name: true,
              username: true,
              id: true,
              image: true,
              protected: true,
              verified: true,
            },
          },
        },
      }),
      this.prisma.post.count({
        where: {
          user: {
            username: {
              in: [...following.map((u) => u.username)],
            },
          },
        },
      }),
    ]);

    return {
      data: {
        data: feed,
        pagination: paginationQuery.getPaginationMeta(totalRecords),
      },
    };
  }

  async changeLikeStatus(
    postId: number,
    username: string,
    status: LikeStatus,
  ): AsyncResult<boolean> {
    const operationMapping = {
      LIKED: {
        likes: {
          connect: {
            username,
          },
        },
        dislikes: {
          disconnect: {
            username,
          },
        },
      },
      DISLIKED: {
        likes: {
          disconnect: {
            username,
          },
        },
        dislikes: {
          connect: {
            username,
          },
        },
      },
      NONE: {
        likes: {
          disconnect: {
            username,
          },
        },
        dislikes: {
          disconnect: {
            username,
          },
        },
      },
    };

    const operation = operationMapping[status];

    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...operation,
      },
    });

    return {
      data: true,
    };
  }

  async getLikes(
    postId: number,
    paginationQuery: PaginationQuery,
  ): AsyncResult<PaginatedResults<MinimalUserResponse[]>> {
    const queryResult = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: {
          select: {
            username: true,
            name: true,
            id: true,
            protected: true,
            verified: true,
            image: true,
          },
          orderBy: {
            createdAt: paginationQuery.order,
          },
          skip: paginationQuery.pageSize * (paginationQuery.page - 1),
          take: paginationQuery.pageSize,
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get likes', 400),
      };
    }

    return {
      data: {
        data: queryResult.likes,
        pagination: paginationQuery.getPaginationMeta(queryResult._count.likes),
      },
    };
  }

  async getDislikes(
    postId: number,
    paginationQuery: PaginationQuery,
  ): AsyncResult<PaginatedResults<MinimalUserResponse[]>> {
    const queryResult = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        dislikes: {
          select: {
            username: true,
            name: true,
            id: true,
            protected: true,
            verified: true,
            image: true,
          },
          orderBy: {
            createdAt: paginationQuery.order,
          },
          skip: paginationQuery.pageSize * (paginationQuery.page - 1),
          take: paginationQuery.pageSize,
        },
        _count: {
          select: {
            dislikes: true,
          },
        },
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get dislikes', 400),
      };
    }

    return {
      data: {
        data: queryResult.dislikes,
        pagination: paginationQuery.getPaginationMeta(queryResult._count.dislikes),
      },
    };
  }
}
