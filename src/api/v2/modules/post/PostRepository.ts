import { Post, PostDocument } from '../../../../models/Post';

/* eslint-disable class-methods-use-this */
class PostRepository {
  async findPostById(id: string): Promise<PostDocument | null> {
    try {
      const post = await Post
        .findById(id)
        .populate('createdBy', 'username name image');
      return post;
    } catch (e) {
      return null;
    }
  }

  async findPostsByUsername(username: string): Promise<PostDocument[] | null> {
    try {
      const posts = await Post
        .find({ username })
        .sort({ createdAt: 'desc' });
      return posts;
    } catch (e) {
      return null;
    }
  }

  async getUserFeed(users: string[]): Promise<PostDocument[] | null> {
    try {
      const posts = await Post
        .find({ createdBy: { $in: users } })
        .populate('createdBy', 'username name image')
        .sort({ createdAt: 'desc' });
      return posts;
    } catch (e) {
      return null;
    }
  }
}

export default PostRepository;
