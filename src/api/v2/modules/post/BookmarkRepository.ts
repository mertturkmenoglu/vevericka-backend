/* eslint-disable class-methods-use-this */
import { Bookmark, BookmarkDocument } from '../../../../models/Bookmark';

class BookmarkRepository {
  async findBookmarkById(id: string): Promise<BookmarkDocument | null> {
    try {
      const bookmark = await Bookmark.findById(id);
      return bookmark;
    } catch (e) {
      return null;
    }
  }

  async getUserBookmarks(username: string, sortDir = -1): Promise<BookmarkDocument[] | null> {
    try {
      const bookmarks = await Bookmark.find({ belongsTo: username }).sort({ createdAt: sortDir });
      return bookmarks;
    } catch (error) {
      return null;
    }
  }

  async bookmarkExists(username: string, postId: string): Promise<boolean> {
    const result = await Bookmark.exists({ belongsTo: username, postId });
    return result;
  }
}

export default BookmarkRepository;
