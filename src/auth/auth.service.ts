import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { AsyncResult } from 'src/types/AsyncResult';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth } from '@prisma/client';
import { AlgoliaService } from 'src/algolia/algolia.service';
import { AuthWithoutPassword } from './types/auth-without-password.type';
import { AuthWithUser } from './types/auth-with-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly algoliaService: AlgoliaService,
  ) {}

  async doesUserExist(username: string, email: string): AsyncResult<boolean> {
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

    return {
      data: user > 0,
    };
  }

  async saveUser(dto: RegisterDto): AsyncResult<AuthWithoutPassword> {
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
    const { user, ...auth } = rest;

    // Update Algolia user index
    await this.algoliaService.saveUser({
      id: auth.userId,
      name: user.name,
      username: user.username,
      image: user.image,
      protected: user.protected,
      verified: user.verified,
    });

    return {
      data: auth,
    };
  }

  async findUserByEmail(email: string): AsyncResult<AuthWithUser> {
    const user = await this.prisma.auth.findUnique({
      where: {
        email,
      },
      include: {
        user: true,
      },
    });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${email}`),
      };
    }

    return {
      data: user,
    };
  }

  async doPasswordsMatch(plain: string, hashed: string): AsyncResult<boolean> {
    const match = await argon2.verify(hashed, plain, { type: argon2.argon2i });
    return {
      data: match,
    };
  }

  async getBearerToken(
    id: number,
    username: string,
    email: string,
    image: string,
  ): AsyncResult<string> {
    const payload = {
      id,
      username,
      email,
      image,
    };

    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    const bearerToken = `Bearer ${jwtToken}`;
    return {
      data: bearerToken,
    };
  }

  async get(email: string): AsyncResult<Auth> {
    const user = await this.prisma.auth.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${email}`),
      };
    }

    return {
      data: user,
    };
  }

  async deleteUser(username: string): AsyncResult<boolean> {
    console.log('auth service', { username });
    const userFromUserTable = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!userFromUserTable) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    const user = await this.prisma.auth.findUnique({
      where: {
        email: userFromUserTable.email,
      },
    });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    await this.prisma.auth.delete({
      where: {
        email: user.email,
      },
    });

    return {
      data: true,
    };
  }

  checkBetaCode(betaCode: string): boolean {
    return betaCode === process.env.BETA_REGISTER_CODE;
  }
}
