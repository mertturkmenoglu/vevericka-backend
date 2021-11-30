import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }

  async doesUserExist(username: string, email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: [{ email }, { username }] });
    return user !== undefined;
  }

  async saveUser(dto: RegisterDto): Promise<User> {
    const savedUser = await this.usersRepository.save({
      email: dto.email,
      name: dto.name,
      username: dto.username,
      password: dto.password,
    });
    return savedUser;
  }

  async get(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
