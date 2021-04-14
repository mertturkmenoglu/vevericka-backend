import { Service } from 'typedi';
import { CommentDocument } from '../models/Comment';
import PostRepository from '../repositories/PostRepository';
import CommentRepository from '../repositories/CommentRepository';

@Service()
class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getCommentById(id: string): Promise<CommentDocument | null> {
    return this.commentRepository.getCommentById(id);
  }

  async getPostById(id: string) {
    return this.postRepository.findPostById(id);
  }

  async deleteComment(id: string) {
    await this.commentRepository.deleteComment(id);
  }
}

export default CommentService;
