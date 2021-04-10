import { Post, PostDocument } from '../../../../models/Post';

/* eslint-disable class-methods-use-this */
class PostRepository {
  async findPostById(id: string): Promise<PostDocument | null> {
    try {
      return await Post
        .findById(id)
        .populate('createdBy', 'username name image')
        .populate({
          path: 'comments',
          populate: {
            path: 'createdBy',
            select: 'username name image',
          },
        });
    } catch (e) {
      return null;
    }
  }

  async findPostsByUsername(userId: string): Promise<PostDocument[] | null> {
    try {
      return await Post
        .find({ createdBy: userId })
        .populate('createdBy', 'name username image')
        .sort({ createdAt: 'desc' });
    } catch (e) {
      return null;
    }
  }

  async getUserFeed(users: string[]): Promise<PostDocument[] | null> {
    try {
      return await Post
        .find({ createdBy: { $in: users } })
        .populate('createdBy', 'username name image')
        .sort({ createdAt: 'desc' });
    } catch (e) {
      return null;
    }
  }
}

export default PostRepository;
