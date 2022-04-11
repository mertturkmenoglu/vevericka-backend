import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExploreService } from './explore.service';

@ApiTags('explore')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'explore',
})
export class ExploreController {
  constructor(private exploreService: ExploreService) {}

  @Get('/tags')
  @ApiOkResponse({
    description:
      'Get popular tags ?time=[today,yesterday,week,month,year,all]&page=1&pageSize=25&location=[global,local]',
  })
  async getPopularTags(@Query() paginationQuery: PaginationQuery) {
    const { data, exception } = await this.exploreService.getPopularTags(paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/tag/:tagName')
  async getTagByTagName(@Param('tagName') tagName: string) {
    const { data, exception } = await this.exploreService.getTagByTagName(tagName);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @Get('/people')
  async getPopularPeople(@Query() paginationQuery: PaginationQuery) {
    const { data, exception } = await this.exploreService.getPopularPeople(paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @Get('/tags-and-people')
  async getPopularTagsAndPeople(@Query() paginationQuery: PaginationQuery) {
    const { data, exception } = await this.exploreService.getPopularTagsAndPeople(paginationQuery);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @Get('/posts')
  async getPopularPosts() {
    return null;
  }
}
