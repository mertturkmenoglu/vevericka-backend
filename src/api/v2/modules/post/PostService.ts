import { Comment, CommentDocument } from '../../../../models/Comment';
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

  // eslint-disable-next-line class-methods-use-this
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return Comment.findById(id);
  }
}

export default PostService;
