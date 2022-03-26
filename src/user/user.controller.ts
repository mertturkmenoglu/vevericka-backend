import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  Post as PostMapping,
  Body,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Language, Speaking, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Followee } from './data/followee.type';
import { Follower } from './data/follower.type';
import { CreateSpeakingLanguageDto } from './dto/create-speaking-language.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { SetProfilePictureDto } from './dto/set-profile-picture.dto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@UseInterceptors(CacheInterceptor)
@Controller({
  version: '3',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  async getAll() {
    return this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const { data, exception } = await this.userService.getUserByUsername(username);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username/followers')
  async getFollowersByUsername(@Param('username') username: string): Promise<Follower[]> {
    const { data, exception } = await this.userService.getFollowersByUsername(username);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/follow')
  @HttpCode(204)
  async followUser(@Body() dto: FollowUserDto): Promise<void> {
    const { data, exception } = await this.userService.followUser(dto);

    if (!data) {
      throw exception;
    }
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/unfollow')
  @HttpCode(204)
  async unfollowUser(@Body() dto: UnfollowUserDto): Promise<void> {
    const { data, exception } = await this.userService.unfollowUser(dto);

    if (!data) {
      throw exception;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username/following')
  async getFollowingByUsername(@Param('username') username: string): Promise<Followee[]> {
    const { data, exception } = await this.userService.getFollowingByUsername(username);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username/speaking')
  async getSpeakingLanguagesByUsername(@Param('username') username: string): Promise<Speaking[]> {
    const { data, exception } = await this.userService.getSpeakingLanguagesByUsername(username);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:username/speaking')
  @HttpCode(204)
  async addSpeakingLanguage(
    @Param('username') username: string,
    @Body() dto: CreateSpeakingLanguageDto,
  ): Promise<void> {
    const { data, exception } = await this.userService.addSpeakingLanguage(username, dto);

    if (!data) {
      throw exception;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:username/speaking/:lang')
  @HttpCode(204)
  async deleteSpeakingLanguage(
    @Param('username') username: string,
    @Param('lang') lang: Language,
  ): Promise<void> {
    const { data, exception } = await this.userService.deleteSpeakingLanguage(username, lang);

    if (!data) {
      throw exception;
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/:username/wish-to-speak')
  // async getWishToSpeakLanguagesByUsername(
  //   @Param('username') username: string,
  // ): Promise<WishToSpeak[]> {
  //   const { data, exception } = await this.userService.getWishToSpeakLanguagesByUsername(username);

  //   if (!data) {
  //     throw exception;
  //   }

  //   return data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('/:username/languages')
  // async getLanguagesByUsername(@Param('username') username: string): Promise<{
  //   speaking: Speaking[];
  //   wishToSpeak: WishToSpeak[];
  // }> {
  //   const { data, exception } = await this.userService.getLanguagesByUsername(username);

  //   if (!data) {
  //     throw exception;
  //   }

  //   return data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('/:username/hobbies')
  // async getHobbiesByUsername(@Param('username') username: string): Promise<Hobby[]> {
  //   const { data, exception } = await this.userService.getHobbiesByUsername(username);

  //   if (!data) {
  //     throw exception;
  //   }

  //   return data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('/:username/features')
  // async getFeaturesByUsername(@Param('username') username: string): Promise<Feature[]> {
  //   const { data, exception } = await this.userService.getFeaturesByUsername(username);

  //   if (!data) {
  //     throw exception;
  //   }

  //   return data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('/:username/posts')
  // async getPostsByUsername(@Param('username') username: string): Promise<Post[]> {
  //   const { data, exception } = await this.userService.getPostsByUsername(username);

  //   if (!data) {
  //     throw exception;
  //   }

  //   return data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @PostMapping('/:username/feature')
  // async addFeature(@Param('username') username: string, @Body() dto: CreateFeatureDto) {
  //   const { data, exception } = await this.userService.addFeature(username, dto);

  //   if (!data) {
  //     throw exception;
  //   }

  //   return data;
  // }

  @UseGuards(JwtAuthGuard)
  @PostMapping('/:username/profile-picture')
  async setProfilePicture(@Param('username') username: string, @Body() dto: SetProfilePictureDto) {
    const { data, exception } = await this.userService.setProfilePicture(username, dto);

    if (!data) {
      throw exception;
    }

    return data;
  }
}
