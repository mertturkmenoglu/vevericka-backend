import { Playlist } from './playlist.model';

export class PlaylistResponse {
  name!: string;

  description!: string;

  displayField!: string;

  fields!: Playlist[];
}
