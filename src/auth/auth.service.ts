import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthWithoutPasswordDto, JwtPayload, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthWithUser } from './types/auth-with-user.type';
import { AsyncResult, createCookie } from '@/common';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  public async doesUserExist(username: string, email: string): Promise<boolean> {
    const user = await this.prisma.auth.count({
      where: {
        OR: [
          {
            email,
          },
          {
            user: {
              username,
            },
          },
        ],
      },
    });

    return user > 0;
  }

  async saveUser(dto: RegisterDto): AsyncResult<AuthWithoutPasswordDto> {
    try {
      const hashed = await argon2.hash(dto.password, { type: argon2.argon2i });

      const saved = await this.prisma.auth.create({
        data: {
          email: dto.email,
          password: hashed,
          user: {
            create: {
              email: dto.email,
              username: dto.username,
              name: dto.name,
              image: dto.image,
            },
          },
        },
        include: {
          user: true,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = saved;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, ...auth } = rest;

      return auth;
    } catch (e) {
      return new InternalServerErrorException('Cannot save user');
    }
  }

  public async findUserByEmail(email: string): AsyncResult<AuthWithUser> {
    const user = await this.prisma.auth.findUnique({
      where: {
        email,
      },
      include: {
        user: true,
      },
    });

    if (!user) {
      return new NotFoundException(`User not found: ${email}`);
    }

    return user;
  }

  public async doPasswordsMatch(plain: string, hashed: string): Promise<boolean> {
    return await argon2.verify(hashed, plain, { type: argon2.argon2i });
  }

  public async deleteUser(username: string): AsyncResult<boolean> {
    const userFromUserTable = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!userFromUserTable) {
      return new NotFoundException(`User not found: ${username}`);
    }

    const user = await this.prisma.auth.findUnique({
      where: {
        email: userFromUserTable.email,
      },
    });

    if (!user) {
      return new NotFoundException(`User not found: ${username}`);
    }

    await this.prisma.auth.delete({
      where: {
        email: user.email,
      },
    });

    await this.prisma.user.delete({
      where: {
        username,
      },
    });

    return true;
  }

  public checkBetaCode(betaCode: string): boolean {
    return betaCode === process.env.BETA_REGISTER_CODE;
  }

  public getCookieWithJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return createCookie({
      name: 'jwt-token',
      value: token,
      maxAge: '7d',
      isHttpOnly: true,
      path: '/',
    });
  }

  public get cookieForLogout(): string {
    return createCookie({
      name: 'jwt-token',
      value: '',
      isHttpOnly: true,
      path: '/',
      maxAge: '0',
    });
  }
}
