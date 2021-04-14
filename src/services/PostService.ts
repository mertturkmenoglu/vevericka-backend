import { Service } from 'typedi';
import { PostDocument } from '../models/Post';
import PostRepository from '../repositories/PostRepository';
import { UserDocument } from '../models/User';

@Service()
class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.postRepository.findPostById(id);
  }

  async getUserPosts(userId: string): Promise<PostDocument[] | null> {
    return this.postRepository.findPostsByUsername(userId);
  }

  async getUserFeed(user: UserDocument): Promise<PostDocument[] | null> {
    const users = [...user.following, user.id];
    return this.postRepository.getUserFeed(users);
  }
}

export default PostService;
