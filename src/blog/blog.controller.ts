import { BadRequestException, Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Playlist } from './playlist.model';

@ApiTags('blog')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'blog',
})
export class BlogController {
  // eslint-disable-next-line prettier/prettier
  constructor(private blogService: BlogService) { }

  @Get('/playlist/latest')
  @ApiOkResponse({
    description: 'Get the latest monthly playlist',
  })
  async getLatestPlaylist(): Promise<Playlist> {
    const latest = await this.blogService.getLatestPlaylist();

    if (latest === null) {
      throw new NotFoundException('Cannot find the latest monthly playlist');
    }

    return latest;
  }

  @Get('/playlist')
  @ApiOkResponse({
    description: 'Get playlist by query',
  })
  async getPlaylist(@Query('year') year: number, @Query('month') month: number): Promise<Playlist> {
    if (year < 2021) {
      throw new BadRequestException('Year value is not valid');
    }

    if (month < 1 || month > 12) {
      throw new BadRequestException('Month value is not valid');
    }

    const playlist = await this.blogService.getPlaylistByQuery(year, month);

    if (playlist === null) {
      throw new NotFoundException('Cannot find the playlist');
    }

    return playlist;
  }
}
