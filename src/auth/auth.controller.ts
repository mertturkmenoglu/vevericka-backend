import {
  BadRequestException,
  Body,
  Controller,
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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthWithoutPasswordDto, LoginDto, RegisterDto } from './dto';
import { isHttpException } from '@/common';

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
  @ApiCreatedResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthWithoutPasswordDto,
  })
  @ApiBadRequestResponse({
    description: 'Beta code is not valid or user already exists',
  })
  @ApiInternalServerErrorResponse({
    description: 'Database operation failed',
  })
  async register(@Body() dto: RegisterDto): Promise<AuthWithoutPasswordDto> {
    const isBetaCodeOk = this.authService.checkBetaCode(dto.betaCode);

    if (!isBetaCodeOk) {
      throw new BadRequestException('Beta code is not valid');
    }

    const doesUserExist = await this.authService.doesUserExist(dto.username, dto.email);

    if (doesUserExist) {
      throw new BadRequestException('User already exists');
    }

    const res = await this.authService.saveUser(dto);

    if (isHttpException(res)) {
      throw new InternalServerErrorException('Cannot register');
    }

    return res;
  }

  @Post('login')
  @ApiNotFoundResponse({
    description: 'User not found with the given email/username',
  })
  @ApiUnauthorizedResponse({
    description: 'Passwords do not match. Email or password is wrong',
  })
  @ApiInternalServerErrorResponse({
    description: 'Cannot process bearer token',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User successfully logged in',
    headers: {
      authorization: {
        description: 'Bearer token',
      },
    },
  })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.findUserByEmail(dto.email);

    if (isHttpException(result)) {
      throw result;
    }

    const doPasswordsMatch = await this.authService.doPasswordsMatch(dto.password, result.password);

    if (!doPasswordsMatch) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    const user = result.user;

    const payload = {
      email: user.email,
      username: user.username,
      image: user.image,
      id: user.id,
    };

    return res
      .cookie('jwt-token', this.authService.signJwtPaylod(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      })
      .json({
        username: user.username,
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.cookieForLogout);
    return res.sendStatus(200);
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
  @Delete('/:username')
  @ApiBearerAuth()
  @HttpCode(204)
  async deleteUser(@Param('username') username: string): Promise<void> {
    const result = await this.authService.deleteUser(username);

    if (isHttpException(result)) {
      throw result;
    }
  }
}
