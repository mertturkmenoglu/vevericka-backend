import { Service } from 'typedi';
import { Bookmark } from '../models/Bookmark';

@Service()
class BookmarkRepository {
  async findBookmarkById(id: string) {
    return Bookmark.findById(id);
  }

  async getUserBookmarks(userId: string) {
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

  async deleteBookmarksByPostId(postId: string) {
    await Bookmark.deleteMany({ postId });
  }
}

export default BookmarkRepository;
