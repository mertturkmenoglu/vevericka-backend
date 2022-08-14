import { HttpException, Injectable } from '@nestjs/common';
import { Short } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AsyncResult } from 'src/types/AsyncResult';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { CreateShortDto } from './dto/create-short.dto';
import { SingleShort } from './types/single-short.type';

@Injectable()
export class ShortService {
  constructor(private readonly prisma: PrismaService) {}

  public async getShortById(id: number): AsyncResult<SingleShort> {
    const short = await this.prisma.short.findUnique({
      where: {
        id,
      },
      include: {
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
      },
    });

    if (!short) {
      return {
        exception: new HttpException('Short not found', 400),
      };
    }

    return {
      data: short,
    };
  }

  public async createShort(dto: CreateShortDto): AsyncResult<SingleShort> {
    const short = await this.prisma.short.create({
      data: {
        url: dto.url,
        user: {
          connect: {
            username: dto.username,
          },
        },
      },
      include: {
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
      },
    });

    return {
      data: short,
    };
  }

  public async deleteShortById(id: number): AsyncResult<boolean> {
    await this.prisma.short.delete({
      where: {
        id,
      },
    });

    return {
      data: true,
    };
  }

  public async getShortsByUsername(
    username: string,
    paginationQuery: PaginationQuery,
  ): Promise<[shorts: Omit<Short, 'user'>[], totalRecords: number]> {
    const [shorts, totalRecords] = await this.prisma.$transaction([
      this.prisma.short.findMany({
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
      }),
      this.prisma.short.count({
        where: {
          user: {
            username,
          },
        },
      }),
    ]);

    return [shorts, totalRecords];
  }
}
