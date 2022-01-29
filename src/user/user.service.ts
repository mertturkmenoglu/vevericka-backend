import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResult } from '../types/AsyncResult';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getUserByUsername(username: string): AsyncResult<User> {
    const user = await this.userRepository.findOne({ where: [{ username }], relations: ['speaking', 'wishToSpeak', 'hobbies', 'features', 'location'] });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    return {
      data: user,
    };
  }
}
