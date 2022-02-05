import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResult } from '../types/AsyncResult';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SetProfilePictureDto } from './dto/set-profile-picture.dto';

@Injectable()
export class UserService {
  // eslint-disable-next-line prettier/prettier
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async getUserByUsername(username: string): AsyncResult<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }],
      relations: ['speaking', 'wishToSpeak', 'hobbies', 'features', 'location'],
    });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    return {
      data: user,
    };
  }

  async setProfilePicture(username: string, dto: SetProfilePictureDto): AsyncResult<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }],
    });

    if (!user) {
      return {
        exception: new NotFoundException(`User not found: ${username}`),
      };
    }

    user.image = dto.url;

    const updated = await this.userRepository.save(user);
    return {
      data: updated,
    };
  }
}
