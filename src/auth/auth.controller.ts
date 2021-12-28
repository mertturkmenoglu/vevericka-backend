import { BadRequestException, Body, Controller, Get, NotFoundException, Post, UnauthorizedException, Res, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces, ApiCreatedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  async register(@Body() dto: RegisterDto): Promise<number> {
    const doesUserExist = await this.authService.doesUserExist(dto.username, dto.email);

    if (doesUserExist) {
      throw new BadRequestException('User already exists');
    }

    const savedUser = await this.authService.saveUser(dto);
    return savedUser.id;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.findUserByEmailSelectPassword(dto.email);

    if (!user) {
      return new NotFoundException(`User not found with email: ${dto.email}`);
    }

    const doPasswordsMatch = await this.authService.doPasswordsMatch(dto.password, user.password);

    if (!doPasswordsMatch) {
      return new UnauthorizedException('Email or password is wrong');
    }

    const bearerToken = await this.authService.getBearerToken(user.id, user.username);

    res.header('authorization', bearerToken);
    return res.json({
      id: user.id,
      username: user.username,
    });
  }

  @Post('password/reset')
  async passwordReset() {
    return '';
  }

  @Post('password/send-email')
  async sendPasswordResetEmail() {
    return '';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ooo/:email')
  @ApiBearerAuth()
  getAuthTest(@Param('email') email: string) {
    return this.authService.get(email);
  }
}
