import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  Post,
  Body,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SetProfilePictureDto } from './dto/set-profile-picture.dto';
import { User } from './user.entity';
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
  // eslint-disable-next-line prettier/prettier
  constructor(private userService: UserService) { }

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
  @Post('/:username/profile-picture')
  async setProfilePicture(@Param('username') username: string, @Body() dto: SetProfilePictureDto) {
    const { data, exception } = await this.userService.setProfilePicture(username, dto);

    if (!data) {
      throw exception;
    }

    return data;
  }
}
