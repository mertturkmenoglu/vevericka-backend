import { PostDocument } from '../../../../models/Post';
import { UserDocument } from '../../../../models/User';
import PostRepository from './PostRepository';

class PostService {
  constructor(readonly postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.postRepository.findPostById(id);
  }

  async getUserPosts(username: string): Promise<PostDocument[] | null> {
    return this.postRepository.findPostsByUsername(username);
  }

  async getUserFeed(user: UserDocument): Promise<PostDocument[] | null> {
    const users = [...user.following, user.id];
    return this.postRepository.getUserFeed(users);
  }
}

export default PostService;
