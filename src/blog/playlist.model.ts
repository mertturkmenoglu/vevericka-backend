import { Media } from './media.model';

export class Playlist {
  title!: string;

  subtitle!: string;

  thumbnail!: Media;

  startsAt!: string;

  endsAt!: string;

  content!: string;
}
