import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { AsyncResult } from 'src/types/AsyncResult';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth, User } from '@prisma/client';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService, private jwtService: JwtService) { }

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

  async saveUser(dto: RegisterDto): AsyncResult<Omit<Auth, 'password'>> {
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
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = saved;

    return {
      data: rest,
    };
  }

  async findUserByEmail(email: string): AsyncResult<
    Auth & {
      user: User;
    }
  > {
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

  checkBetaCode(betaCode: string): boolean {
    return betaCode === process.env.BETA_REGISTER_CODE;
  }
}
