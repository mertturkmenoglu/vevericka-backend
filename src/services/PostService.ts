import { Service } from 'typedi';
import { PostDocument } from '../models/Post';
import PostRepository from '../repositories/PostRepository';
import { UserDocument } from '../models/User';
import CommentRepository from '../repositories/CommentRepository';
import BookmarkRepository from '../repositories/BookmarkRepository';

@Service()
class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly bookmarkRepository: BookmarkRepository,
  ) {}

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

  async deletePost(postId: string) {
    await this.postRepository.deletePost(postId);
    await this.commentRepository.deleteCommentsByPostId(postId);
    await this.bookmarkRepository.deleteBookmarksByPostId(postId);
  }
}

export default PostService;
