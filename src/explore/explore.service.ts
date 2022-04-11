import { HttpException, Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AsyncResult } from 'src/types/AsyncResult';
import { MinimalUserResponse } from 'src/types/MinimalUserResponse';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { TagsAndPeople } from './types/TagsAndPeople';
import { TagWithCount } from './types/TagWithCount';

@Injectable()
export class ExploreService {
  constructor(private readonly prisma: PrismaService) {}

  async getPopularTags(
    paginationQuery: PaginationQuery,
  ): AsyncResult<PaginatedResults<TagWithCount[]>> {
    const [tagsResult, totalRecords] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        skip: paginationQuery.skip,
        take: paginationQuery.pageSize,
      }),
      this.prisma.tag.count(),
    ]);

    if (!tagsResult) {
      return {
        exception: new HttpException('Cannot get tags', 400),
      };
    }

    return {
      data: {
        data: tagsResult,
        pagination: paginationQuery.getPaginationMeta(totalRecords),
      },
    };
  }

  async getTagByTagName(tagName: string): AsyncResult<Tag> {
    const queryResult = await this.prisma.tag.findUnique({
      where: {
        tagName,
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get tag', 400),
      };
    }

    return {
      data: queryResult,
    };
  }

  async getPopularPeople(
    paginationQuery: PaginationQuery,
  ): AsyncResult<PaginatedResults<MinimalUserResponse[]>> {
    const [usersResult, totalRecords] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        include: {
          _count: {
            select: {
              followers: true,
            },
          },
        },
        orderBy: {
          followers: {
            _count: 'desc',
          },
        },
        skip: paginationQuery.skip,
        take: paginationQuery.pageSize,
      }),
      this.prisma.tag.count(),
    ]);

    if (!usersResult) {
      return {
        exception: new HttpException('Cannot get popular people', 400),
      };
    }

    const result = usersResult.map((user) => {
      const { id, username, name, image, protected: isProtected, verified } = user;
      return { id, username, name, image, protected: isProtected, verified };
    });

    return {
      data: {
        data: result,
        pagination: paginationQuery.getPaginationMeta(totalRecords),
      },
    };
  }

  async getPopularTagsAndPeople(paginationQuery: PaginationQuery): AsyncResult<TagsAndPeople> {
    const { data: tagsData, exception: tagsException } = await this.getPopularTags(paginationQuery);

    if (!tagsData) {
      return {
        exception: tagsException,
      };
    }

    const { data: peopleData, exception: peopleException } = await this.getPopularPeople(
      paginationQuery,
    );

    if (!peopleData) {
      return {
        exception: peopleException,
      };
    }

    return {
      data: {
        tags: tagsData,
        people: peopleData,
      },
    };
  }
}
