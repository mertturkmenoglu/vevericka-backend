import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './auth.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) { }

  async doesUserExist(username: string, email: string): Promise<boolean> {
    const user = await this.authRepository.createQueryBuilder('auth')
      .leftJoinAndSelect('auth.user', 'user')
      .where('auth.email = :email', { email })
      .orWhere('user.username = :username', { username })
      .getOne();

    return user !== undefined;
  }

  async saveUser(dto: RegisterDto): Promise<Omit<Auth, 'password'>> {
    const hashed = await argon2.hash(dto.password, { type: argon2.argon2i });
    const auth = new Auth();
    auth.email = dto.email;
    auth.password = hashed;

    const user = new User();
    user.email = dto.email;
    user.username = dto.username;
    user.name = dto.name;
    user.image = dto.image;

    auth.user = user;

    const saved = await this.authRepository.save(auth);

    const { password, ...rest } = saved;

    return rest;
  }

  async findUserByEmail(email: string): Promise<Auth | undefined> {
    const user = await this.authRepository.findOne({ where: [{ email }], relations: ['user'] },);
    return user;
  }

  async doPasswordsMatch(plain: string, hashed: string): Promise<boolean> {
    const match = await argon2.verify(hashed, plain, { type: argon2.argon2i });
    return match;
  }

  async getBearerToken(id: number, username: string, email: string, image: string): Promise<string> {
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
    return bearerToken;
  }

  async get(email: string): Promise<Auth | undefined> {
    return await this.authRepository.findOne({ where: { email } });
  }
}
