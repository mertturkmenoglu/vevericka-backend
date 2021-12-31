import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    return user;
  }
}
