import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  Res,
  UseGuards,
  Param,
  InternalServerErrorException,
  HttpCode,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiProduces,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthWithoutPassword } from './types/auth-without-password.type';

@ApiTags('auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ status: 201, description: 'User registered successfully' })
  @ApiBadRequestResponse({ status: 400 })
  async register(@Body() dto: RegisterDto): Promise<AuthWithoutPassword> {
    const isBetaCodeOk = this.authService.checkBetaCode(dto.betaCode);

    if (!isBetaCodeOk) {
      throw new BadRequestException('Beta code is not valid');
    }

    const { data: doesUserExist } = await this.authService.doesUserExist(dto.username, dto.email);

    if (doesUserExist) {
      throw new BadRequestException('User already exists');
    }

    const { data } = await this.authService.saveUser(dto);

    if (!data) {
      throw new InternalServerErrorException('Cannot register');
    }

    return data;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { data: auth, exception } = await this.authService.findUserByEmail(dto.email);

    if (!auth) {
      throw exception;
    }

    const { data: doPasswordsMatch } = await this.authService.doPasswordsMatch(
      dto.password,
      auth.password,
    );

    if (!doPasswordsMatch) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    const user = auth.user;

    const { data: bearerToken } = await this.authService.getBearerToken(
      user.id,
      user.username,
      user.email,
      user.image,
    );

    if (!bearerToken) {
      throw new InternalServerErrorException('Cannot login');
    }

    res.header('authorization', bearerToken);
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
      token: bearerToken,
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:username')
  @ApiBearerAuth()
  @HttpCode(204)
  async deleteUser(@Param('username') username: string): Promise<void> {
    const { data, exception } = await this.authService.deleteUser(username);

    if (!data) {
      throw exception;
    }
  }
}
