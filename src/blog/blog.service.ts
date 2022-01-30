import { Injectable } from '@nestjs/common';
import { ContentfulService } from './contentful.service';
import { Playlist } from './playlist.model';

@Injectable()
export class BlogService {
  // eslint-disable-next-line prettier/prettier
  constructor(private contentfulService: ContentfulService) { }

  async getLatestPlaylist(): Promise<Playlist | null> {
    return this.contentfulService.getLatestPlaylist();
  }

  async getPlaylistByQuery(year: number, month: number): Promise<Playlist | null> {
    return this.contentfulService.getPlaylistByQuery(year, month);
  }
}
