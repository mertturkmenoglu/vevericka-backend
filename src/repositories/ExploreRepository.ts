import { Service } from 'typedi';
import { Post } from '../models/Post';

@Service()
class ExploreRepository {
  async getTrendingPeople() {
    try {
      return await Post.aggregate<{
        user: { image: string; name: string; username: string };
      }>()
        .unwind('comments')
        .sortByCount('_id')
        .limit(100)
        .lookup({
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post',
        })
        .group({
          _id: '$post.createdBy',
        })
        .unwind('_id')
        .lookup({
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        })
        .unwind('user')
        .project({
          _id: 0,
          user: {
            username: '$user.username',
            name: '$user.name',
            image: '$user.image',
          },
        });
    } catch (e) {
      return null;
    }
  }

  async getTrendingTags() {
    try {
      return await Post.aggregate<{ tag: string; count: number }>()
        .unwind('hashtags')
        .sortByCount('hashtags')
        .limit(10)
        .project({
          _id: 0,
          tag: '$_id',
          count: '$count',
        });
    } catch (e) {
      return null;
    }
  }
}

export default ExploreRepository;
