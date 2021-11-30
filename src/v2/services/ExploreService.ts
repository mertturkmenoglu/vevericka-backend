import { Service } from 'typedi';
import PostRepository from '../repositories/PostRepository';
import ExploreRepository from '../repositories/ExploreRepository';

@Service()
class ExploreService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly exploreRepository: ExploreRepository,
  ) {}

  async getPostsByTag(tag: string) {
    return this.postRepository.getPostsByTag(tag);
  }

  async getTrendingPosts() {
    return this.postRepository.getPostsSortByCommentCount();
  }

  async getTags() {
    const tags = await this.exploreRepository.getTrendingTags();

    if (!tags) {
      return [];
    }

    return tags;
  }

  async getTrendingPeople() {
    const people = await this.exploreRepository.getTrendingPeople();

    if (!people) {
      return [];
    }

    return people;
  }
}

export default ExploreService;
