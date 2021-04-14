/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Bookmark, BookmarkDocument } from '../../../../models/Bookmark';
import { Comment, CommentDocument } from '../../../../models/Comment';

@Service()
class PostService {
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return Comment.findById(id);
  }
}

export default PostService;
