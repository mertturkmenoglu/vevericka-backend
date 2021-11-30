import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';

@ApiTags('auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiCreatedResponse({ status: 201, description: 'User registered successfully' })
  @ApiBadRequestResponse({ status: 400 })
  async register(@Body() dto: RegisterDto): Promise<User> {
    const doesUserExist = await this.authService.doesUserExist(dto.username, dto.email);

    if (doesUserExist) {
      throw new BadRequestException('User already exists');
    }

    const savedUser = await this.authService.saveUser(dto);
    return savedUser;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.get(dto.email);
  }

  @Post('password/reset')
  async passwordReset() {
    return '';
  }

  @Post('password/send-email')
  async sendPasswordResetEmail() {
    return '';
  }

  @Get()
  getAuthTest() {
    return this.authService.get('');
  }
}
