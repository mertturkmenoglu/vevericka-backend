import { Injectable } from '@nestjs/common';
import { ContentfulClientApi, createClient } from 'contentful';
import { ContentfulLocale } from '../types/locale.type';
import { Playlist } from './playlist.model';

@Injectable()
export class ContentfulService {
  private _locale: ContentfulLocale = 'en-US';

  private get client(): ContentfulClientApi {
    return createClient({
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: process.env.CONTENTFUL_ENVIRONMENT as string,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
    });
  }

  public set locale(value: ContentfulLocale) {
    this._locale = value;
  }

  public get locale() {
    return this._locale;
  }

  public async getAllPlaylists(): Promise<Playlist[]> {
    const res = await this.client.getEntries<Playlist>({
      content_type: 'monthlyPlaylist',
      locale: this.locale,
    });

    return res.items.map((it) => it.fields);
  }

  public async getLatestPlaylist(): Promise<Playlist | null> {
    const playlists = await this.getAllPlaylists();
    let latest: Playlist | null = null;

    for (const playlist of playlists) {
      if (latest === null) {
        latest = playlist;
      }
      const playlistEnd = new Date(playlist.endsAt);
      const latestEnd = new Date(latest.endsAt);

      if (playlistEnd.getTime() > latestEnd.getTime()) {
        latest = playlist;
      }
    }

    return latest;
  }

  public async getPlaylistByQuery(year: number, month: number): Promise<Playlist | null> {
    const playlists = await this.getAllPlaylists();
    const queryDate = new Date(year, month - 1, 15);

    for (const playlist of playlists) {
      const playlistStartDate = new Date(playlist.startsAt);
      const playlistEndDate = new Date(playlist.endsAt);

      if (
        playlistStartDate.getTime() < queryDate.getTime() &&
        playlistEndDate.getTime() > queryDate.getTime()
      ) {
        return playlist;
      }
    }

    return null;
  }
}
