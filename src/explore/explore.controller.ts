import { Controller, Get, Param } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ExploreService } from './explore.service';

@ApiTags('explore')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'explore'
})
export class ExploreController {
  constructor(private exploreService: ExploreService) { }

  @Get('/tags')
  @ApiOkResponse({ description: 'Get popular tags ?time=[today,yesterday,week,month,year,all]&page=1&pageSize=25&location=[global,local]' })
  async getPopularTags() {
    return this.exploreService.testFunction();
  }

  @Get('/tag/:id')
  async getTagById(@Param('id') id: string) {
    return id;
  }

  @Get('/tag/:id/posts')
  async getTagPosts(@Param('id') id: string) {
    return id;
  }

  @Get('/people')
  async getPopularPeople() {
    return null;
  }

  @Get('/posts')
  async getPopularPosts() {
    return null;
  }
}
