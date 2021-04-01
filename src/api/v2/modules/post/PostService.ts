import { PostDocument } from '../../../../models/Post';
import PostRepository from './PostRepository';

class PostService {
  constructor(readonly postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.postRepository.findPostById(id);
  }
}

export default PostService;
