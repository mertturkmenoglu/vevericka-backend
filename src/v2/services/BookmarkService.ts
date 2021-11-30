import { Service } from 'typedi';
import { BookmarkDocument } from '../models/Bookmark';
import BookmarkRepository from '../repositories/BookmarkRepository';
import PostRepository from '../repositories/PostRepository';

@Service()
class BookmarkService {
  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getPostById(postId: string) {
    return this.postRepository.findPostById(postId);
  }

  async getBookmarkById(id: string): Promise<BookmarkDocument | null> {
    return this.bookmarkRepository.findBookmarkById(id);
  }

  async getUserBookmarks(userId: string): Promise<BookmarkDocument[] | null> {
    return this.bookmarkRepository.getUserBookmarks(userId);
  }
}

export default BookmarkService;
