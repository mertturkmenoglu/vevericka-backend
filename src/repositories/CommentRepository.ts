import { Service } from 'typedi';
import { Comment } from '../models/Comment';

@Service()
class CommentRepository {
  async getCommentById(id: string) {
    return Comment.findById(id);
  }

  async deleteComment(id: string) {
    await Comment.findByIdAndDelete(id);
  }

  async deleteCommentsByPostId(postId: string) {
    await Comment.deleteMany({ postId });
  }
}

export default CommentRepository;
