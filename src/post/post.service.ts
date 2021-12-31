import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) { }

  async getPostById(id: string): Promise<Post | null> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      return null;
    }

    return post;
  }

  async createPost(dto: CreatePostDto): Promise<Post | null> {
    const user = await this.userService.getUserByUsername(dto.username);

    if (!user) {
      return null;
    }

    const post = new Post();
    post.content = dto.content;
    post.user = user;

    const saved = await this.postRepository.save(post);
    return saved;
  }

  async getPostsByUsername(username: string, page: number, pageSize: number): Promise<[posts: Omit<Post, 'user'>[], totalRecords: number]> {
    const [posts, totalRecords] = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('user.username = :username', { username })
      .addOrderBy('post.createdAt', 'ASC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount();

    const omitUser = posts.map((post) => {
      const { user, ...rest } = post;
      return rest;
    })

    return [omitUser, totalRecords];
  }
}
