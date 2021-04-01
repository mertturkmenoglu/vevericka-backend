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
}

export default PostRepository;
