import { Length } from 'class-validator';

class Location {
  @Length(1, 64)
  city!: string;

  @Length(1, 64)
  country!: string;
}

export default Location;
