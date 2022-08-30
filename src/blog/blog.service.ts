import { Injectable } from '@nestjs/common';
import { ContentfulService } from './contentful.service';
import { ApiLocale, mapApiToContentfulLocale } from '../types/locale.type';
import { Playlist } from './playlist.model';

@Injectable()
export class BlogService {
  constructor(private contentfulService: ContentfulService) {}

  async getLatestPlaylist(lang: ApiLocale): Promise<Playlist | null> {
    this.contentfulService.locale = mapApiToContentfulLocale[lang];
    return this.contentfulService.getLatestPlaylist();
  }

  async getPlaylistByQuery(year: number, month: number): Promise<Playlist | null> {
    return this.contentfulService.getPlaylistByQuery(year, month);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return this.contentfulService.getAllPlaylists();
  }
}
