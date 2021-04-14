/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Bookmark, BookmarkDocument } from '../../../../models/Bookmark';
import { Comment, CommentDocument } from '../../../../models/Comment';

@Service()
class PostService {
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return Comment.findById(id);
  }

  async getBookmarkById(id: string): Promise<BookmarkDocument | null> {
    return Bookmark.findById(id);
  }

  async getUserBookmarks(userId: string): Promise<BookmarkDocument[] | null> {
    return Bookmark.find({ belongsTo: userId })
      .populate('belongsTo', 'username name image')
      .populate({
        path: 'postId',
        populate: {
          path: 'createdBy',
          select: 'username name image',
        },
      });
  }
}

export default PostService;
