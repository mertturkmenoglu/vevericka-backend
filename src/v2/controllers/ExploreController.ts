import { Get, JsonController, Param, UseBefore, UseInterceptor } from 'routing-controllers';
import { Service } from 'typedi';
import IsAuth from '../middlewares/IsAuth';
import { DocumentToJsonInterceptor } from '../interceptors/DocumentToJsonInterceptor';
import ExploreService from '../services/ExploreService';

@JsonController('/api/v2/explore')
@UseInterceptor(DocumentToJsonInterceptor)
@Service()
class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get('/tags')
  @UseBefore(IsAuth)
  async getTags() {
    const result = await this.exploreService.getTags();
    if (!result) {
      return [];
    }

    return result;
  }

  @Get('/tag/:tag')
  @UseBefore(IsAuth)
  async getPostsByTag(@Param('tag') tag: string) {
    const result = await this.exploreService.getPostsByTag(tag);
    if (!result) {
      return [];
    }
    return result;
  }

  @Get('/people')
  @UseBefore(IsAuth)
  async getPeople() {
    const result = await this.exploreService.getTrendingPeople();
    if (!result) {
      return [];
    }
    return result;
  }

  @Get('/posts')
  @UseBefore(IsAuth)
  async getPosts() {
    const result = await this.exploreService.getTrendingPosts();
    if (!result) {
      return [];
    }
    return result;
  }
}

export default ExploreController;
