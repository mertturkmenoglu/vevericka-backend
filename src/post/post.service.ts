import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment, Post, User } from '@prisma/client';
import { SinglePost } from './types/single-post.type';
import { AsyncResult } from 'src/types/AsyncResult';
import { LikeStatus } from './types/like-status.enum';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { MinimalUserResponse } from 'src/types/MinimalUserResponse';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

  /**
   * Get a post with the given id, populate relational fields and check the LikeStatus
   * @param id is the post id
   * @param thisUsername is the username of the user performing the request
   * @returns a SinglePost object (async result)
   */
  async getPostById(id: number, thisUsername: string): AsyncResult<SinglePost> {
    // Get post and populate relational fields
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
        images: true,
        videos: true,
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

    // Find whether this post was liked/disliked by the person performing the query
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

    const likeStatus = this.getLikeStatus(likeQueryResult.likes, likeQueryResult.dislikes);

    if (!post) {
      return {
        exception: new HttpException('Cannot get post', 400),
      };
    }

    const { _count: count, ...rest } = post;

    // Merge all the information.
    // This service method should always retun SinglePost object.
    // Keep up to date with the data model.
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

  async deletePostById(id: number): AsyncResult<boolean> {
    await this.prisma.post.delete({
      where: {
        id,
      },
    });

    return {
      data: true,
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
        images: {
          createMany: {
            data: dto.images.map((image) => ({
              url: image,
            })),
          },
        },
        videos: {
          createMany: {
            data: dto.videos.map((video) => ({
              url: video,
            })),
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
        images: true,
        videos: true,
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
          tags: true,
          images: true,
          videos: true,
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
    const followingAndUser = [...following, { username }];

    const [feedResult, totalRecords] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: {
          user: {
            username: {
              in: [...followingAndUser.map((u) => u.username)],
            },
          },
        },
        orderBy: {
          createdAt: paginationQuery.order,
        },
        skip: paginationQuery.pageSize * (paginationQuery.page - 1),
        take: paginationQuery.pageSize,
        include: {
          images: true,
          videos: true,
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
          likes: {
            where: {
              username,
            },
          },
          dislikes: {
            where: {
              username,
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

    const feed = feedResult.map((post) => {
      const { likes, dislikes, ...postRest } = post;
      const likeStatus = this.getLikeStatus(likes, dislikes);

      return {
        ...postRest,
        likeStatus,
      };
    });

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

  async getPostComments(
    postId: number,
    paginationQuery: PaginationQuery,
  ): AsyncResult<PaginatedResults<Comment[]>> {
    const [queryResult, totalRecords] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: {
          postId,
        },
        orderBy: {
          createdAt: paginationQuery.order,
        },
        skip: paginationQuery.pageSize * (paginationQuery.page - 1),
        take: paginationQuery.pageSize,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      }),
      this.prisma.comment.count({
        where: {
          postId,
        },
      }),
    ]);

    return {
      data: {
        data: queryResult,
        pagination: paginationQuery.getPaginationMeta(totalRecords),
      },
    };
  }

  async createComment(postId: number, dto: CreateCommentDto): AsyncResult<Comment> {
    const result = await this.prisma.comment.create({
      data: {
        content: dto.content,
        user: {
          connect: {
            username: dto.username,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return {
      data: result,
    };
  }

  async deleteComment(commentId: number): AsyncResult<boolean> {
    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return {
      data: true,
    };
  }

  private getLikeStatus(likes: User[], dislikes: User[]): LikeStatus {
    const likeMapping = {
      like: likes.length > 0,
      dislike: dislikes.length > 0,
    };

    if (likeMapping.like) {
      return LikeStatus.LIKED;
    }

    if (likeMapping.dislike) {
      return LikeStatus.DISLIKED;
    }

    return LikeStatus.NONE;
  }
}
