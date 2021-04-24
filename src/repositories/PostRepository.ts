import { Service } from 'typedi';
import { Post as PostModel, Post, PostDocument } from '../models/Post';
import CreatePostDao from '../types/CreatePostDao';

@Service()
class PostRepository {
  async findPostById(id: string): Promise<PostDocument | null> {
    try {
      return await Post.findById(id)
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
      return await Post.find({ createdBy: userId })
        .populate('createdBy', 'name username image')
        .sort({ createdAt: 'desc' });
    } catch (e) {
      return null;
    }
  }

  async getUserFeed(users: string[]): Promise<PostDocument[] | null> {
    try {
      return await Post.find({ createdBy: { $in: users } })
        .populate('createdBy', 'username name image')
        .sort({ createdAt: 'desc' });
    } catch (e) {
      return null;
    }
  }

  async deletePost(postId: string) {
    await PostModel.findByIdAndDelete(postId);
  }

  async getPostsByTag(tag: string) {
    try {
      return await Post.find({ hashtags: { $elemMatch: { $eq: tag } } });
    } catch (e) {
      return null;
    }
  }

  async getPostsSortByCommentCount() {
    try {
      return await Post.aggregate<PostDocument>([
        {
          $unwind: '$comments',
        },
        {
          $sortByCount: '$comments',
        },
        {
          $limit: 100,
        },
      ]);
    } catch (e) {
      return null;
    }
  }

  async savePost(doc: CreatePostDao) {
    try {
      return await new Post(doc).save();
    } catch (e) {
      return null;
    }
  }
}

export default PostRepository;
