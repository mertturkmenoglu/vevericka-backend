/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Bookmark, BookmarkDocument } from '../../../../models/Bookmark';
import { Comment, CommentDocument } from '../../../../models/Comment';
import { PostDocument } from '../../../../models/Post';
import { UserDocument } from '../../../../models/User';
import PostRepository from './PostRepository';

@Service()
class PostService {
  constructor(private readonly postRepository: PostRepository) { }

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

  async getCommentById(id: string): Promise<CommentDocument | null> {
    return Comment.findById(id);
  }

  async getBookmarkById(id: string): Promise<BookmarkDocument | null> {
    return Bookmark.findById(id);
  }

  async getUserBookmarks(userId: string): Promise<BookmarkDocument[] | null> {
    return Bookmark
      .find({ belongsTo: userId })
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
