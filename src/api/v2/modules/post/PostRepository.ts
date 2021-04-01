import { Post, PostDocument } from '../../../../models/Post';

/* eslint-disable class-methods-use-this */
class PostRepository {
  async findPostById(id: string): Promise<PostDocument | null> {
    try {
      const post = await Post.findById(id);
      return post;
    } catch (e) {
      return null;
    }
  }

  async findPostsByUsername(username: string): Promise<PostDocument[] | null> {
    try {
      const posts = await Post.find({ username }).sort({ createdAt: 'desc' });
      return posts;
    } catch (e) {
      return null;
    }
  }

  async getUserFeed(users: string[]): Promise<PostDocument[] | null> {
    try {
      const posts = await Post
        .find({ createdBy: { $in: users } })
        .populate('createdBy')
        .sort({ createdAt: 'desc' });
      return posts;
    } catch (e) {
      return null;
    }
  }
}

export default PostRepository;
