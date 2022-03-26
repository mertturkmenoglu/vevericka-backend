import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { AsyncResult } from '../types/AsyncResult';
import { SetProfilePictureDto } from './dto/set-profile-picture.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Language, Speaking, User } from '@prisma/client';
import { Follower } from './data/follower.type';
import FollowUserDto from 'dist/v2/dto/FollowUserDto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { Followee } from './data/followee.type';
import { CreateSpeakingLanguageDto } from './dto/create-speaking-language.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUsername(username: string): AsyncResult<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        speaking: true,
        wishToSpeak: true,
        hobbies: true,
        features: true,
      },
    });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    return {
      data: user,
    };
  }

  async setProfilePicture(username: string, dto: SetProfilePictureDto): AsyncResult<User> {
    const userQuery = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!userQuery) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    const user = await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        image: dto.url,
      },
    });

    return {
      data: user,
    };
  }

  async getFollowersByUsername(username: string): AsyncResult<Follower[]> {
    const followersQueryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        followers: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            verified: true,
            protected: true,
          },
        },
      },
    });

    if (!followersQueryResult) {
      return {
        exception: new NotFoundException(),
      };
    }

    const { followers } = followersQueryResult;

    return {
      data: followers,
    };
  }

  async followUser(dto: FollowUserDto): AsyncResult<boolean> {
    const isFollowing =
      (await this.prisma.user.count({
        where: {
          username: dto.thisUsername,
          following: {
            some: {
              username: dto.otherUsername,
            },
          },
        },
      })) > 0;

    if (isFollowing) {
      return {
        exception: new HttpException('Already following', 401),
      };
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          username: dto.thisUsername,
        },
        data: {
          following: {
            connect: {
              username: dto.otherUsername,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          username: dto.otherUsername,
        },
        data: {
          followers: {
            connect: {
              username: dto.thisUsername,
            },
          },
        },
      }),
    ]);

    return {
      data: true,
    };
  }

  async unfollowUser(dto: UnfollowUserDto): AsyncResult<boolean> {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          username: dto.thisUsername,
        },
        data: {
          following: {
            disconnect: {
              username: dto.otherUsername,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          username: dto.otherUsername,
        },
        data: {
          followers: {
            disconnect: {
              username: dto.thisUsername,
            },
          },
        },
      }),
    ]);

    return {
      data: true,
    };
  }

  async getFollowingByUsername(username: string): AsyncResult<Followee[]> {
    const followingQueryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            verified: true,
            protected: true,
          },
        },
      },
    });

    if (!followingQueryResult) {
      return {
        exception: new NotFoundException('Not found'),
      };
    }

    const { following } = followingQueryResult;

    return {
      data: following,
    };
  }

  async getSpeakingLanguagesByUsername(username: string): AsyncResult<Speaking[]> {
    try {
      const queryResult = await this.prisma.speaking.findMany({
        where: {
          user: {
            username,
          },
        },
      });

      return {
        data: queryResult,
      };
    } catch (e) {
      console.log(e, JSON.stringify(e));
      return {
        exception: new HttpException('Db error', 500),
      };
    }
  }

  async addSpeakingLanguage(
    username: string,
    dto: CreateSpeakingLanguageDto,
  ): AsyncResult<boolean> {
    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        speaking: {
          create: {
            ...dto,
          },
        },
      },
    });

    return {
      data: true,
    };
  }

  async deleteSpeakingLanguage(username: string, lang: Language): AsyncResult<boolean> {
    const langQuery = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        speaking: true,
      },
    });

    const langId = langQuery?.speaking.find((lng) => lng.language === lang)?.id;

    await this.prisma.speaking.delete({
      where: {
        id: langId,
      },
    });

    return {
      data: true,
    };
  }

  async getAll() {
    return this.prisma.user.findMany();
  }
}
