import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { AsyncResult } from '../types/AsyncResult';
import { SetProfilePictureDto } from './dto/set-profile-picture.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Feature, Hobby, Language, Speaking, User, WishToSpeak } from '@prisma/client';
import { Follower } from './types/follower.type';
import FollowUserDto from 'dist/v2/dto/FollowUserDto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { Followee } from './types/followee.type';
import { CreateSpeakingLanguageDto } from './dto/create-speaking-language.dto';
import { CreateWishToSpeakLanguageDto } from './dto/create-wish-to-speak-language.dto';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { Profile } from './types/profile.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUsername(username: string): AsyncResult<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
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

  async getWishToSpeakLanguagesByUsername(username: string): AsyncResult<WishToSpeak[]> {
    const queryResult = await this.prisma.wishToSpeak.findMany({
      where: {
        user: {
          username,
        },
      },
    });

    return {
      data: queryResult,
    };
  }

  async addWishToSpeakLanguage(
    username: string,
    dto: CreateWishToSpeakLanguageDto,
  ): AsyncResult<boolean> {
    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        wishToSpeak: {
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

  async deleteWishToSpeakLanguage(username: string, lang: Language): AsyncResult<boolean> {
    const langQuery = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        wishToSpeak: true,
      },
    });

    const langId = langQuery?.wishToSpeak.find((lng) => lng.language === lang)?.id;

    await this.prisma.wishToSpeak.delete({
      where: {
        id: langId,
      },
    });

    return {
      data: true,
    };
  }

  async getLanguagesByUsername(username: string): AsyncResult<{
    speaking: Speaking[];
    wishToSpeak: WishToSpeak[];
  }> {
    const queryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        wishToSpeak: true,
        speaking: true,
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get languages', 400),
      };
    }

    const { speaking, wishToSpeak } = queryResult;

    return {
      data: {
        wishToSpeak,
        speaking,
      },
    };
  }

  async getHobbiesByUsername(username: string): AsyncResult<Hobby[]> {
    const queryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        hobbies: true,
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get hobbies', 400),
      };
    }

    const { hobbies } = queryResult;

    return {
      data: hobbies,
    };
  }

  async addHobby(username: string, dto: CreateHobbyDto): AsyncResult<boolean> {
    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        hobbies: {
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

  async deleteHobby(hobbyId: number): AsyncResult<boolean> {
    await this.prisma.hobby.delete({
      where: {
        id: hobbyId,
      },
    });

    return {
      data: true,
    };
  }

  async getFeaturesByUsername(username: string): AsyncResult<Feature[]> {
    const queryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        features: true,
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get features', 400),
      };
    }

    const { features } = queryResult;

    return {
      data: features,
    };
  }

  async addFeature(username: string, dto: CreateFeatureDto): AsyncResult<boolean> {
    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        features: {
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

  async deleteFeature(featureId: number): AsyncResult<boolean> {
    await this.prisma.feature.delete({
      where: {
        id: featureId,
      },
    });

    return {
      data: true,
    };
  }

  async getHobbiesAndFeaturesByUsername(username: string): AsyncResult<{
    hobbies: Hobby[];
    features: Feature[];
  }> {
    const queryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        hobbies: true,
        features: true,
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get hobbies and features', 400),
      };
    }

    const { hobbies, features } = queryResult;

    return {
      data: {
        hobbies,
        features,
      },
    };
  }

  async getProfileByUsername(username: string): AsyncResult<Profile> {
    const queryResult = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        speaking: true,
        wishToSpeak: true,
        features: true,
        hobbies: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!queryResult) {
      return {
        exception: new HttpException('Cannot get profile', 400),
      };
    }

    const { _count: count, ...rest } = queryResult;

    const profile: Profile = {
      ...rest,
      followersCount: count.followers,
      followingCount: count.following,
      postsCount: count.posts,
    };

    return {
      data: profile,
    };
  }

  async getAll() {
    return this.prisma.user.findMany();
  }
}
