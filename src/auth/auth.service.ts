import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';

export type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async doesUserExist(username: string, email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: [{ email }, { username }] });
    return user !== undefined;
  }

  async saveUser(dto: RegisterDto): Promise<UserWithoutPassword> {
    const hashedPassword = await argon2.hash(dto.password);
    const savedUser = await this.usersRepository.save({
      email: dto.email,
      name: dto.name,
      username: dto.username,
      password: hashedPassword,
    });
    return savedUser;
  }

  async findUserByEmail(email: string): Promise<UserWithoutPassword | undefined> {
    const user = await this.usersRepository.findOne({ where: [{ email }] });
    return user;
  }

  async findUserByEmailSelectPassword(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .where('user.email = :email')
      .select('*')
      .setParameters({ email })
      .getOne();
    return user;
  }

  async doPasswordsMatch(plain: string, hashed: string): Promise<boolean> {
    const match = await argon2.verify(hashed, plain);
    return match;
  }

  async getBearerToken(id: number, username: string): Promise<string> {
    const payload = {
      id,
      username,
    };

    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    const bearerToken = `Bearer ${jwtToken}`;
    return bearerToken;
  }

  async get(email: string): Promise<UserWithoutPassword | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
