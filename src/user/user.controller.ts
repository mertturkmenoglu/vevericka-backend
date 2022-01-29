import { Controller, Get, Param, UseGuards, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
}
