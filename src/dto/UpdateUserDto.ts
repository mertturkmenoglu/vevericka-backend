import { IsDate, MaxLength, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import Language from './UpdateUserLanguage';
import Location from './UpdateUserLocation';

class UpdateUserDto {
  @MinLength(1)
  username!: string;

  @ValidateIf((it) => it.name)
  @MaxLength(255)
  name?: string;

  @ValidateIf((it) => it.image)
  @MinLength(1)
  image?: string;

  @ValidateIf((it) => it.hobbies)
  @MinLength(1, {
    each: true,
  })
  @MaxLength(64, {
    each: true,
  })
  hobbies?: string[];

  @ValidateIf((it) => it.features)
  @MinLength(1, {
    each: true,
  })
  @MaxLength(64, {
    each: true,
  })
  features?: string[];

  @ValidateIf((it) => it.bdate)
  @IsDate()
  bdate?: Date;

  @ValidateIf((it) => it.location)
  @ValidateNested()
  location?: Location;

  @ValidateIf((it) => it.job)
  @MinLength(1)
  @MaxLength(64)
  job?: string;

  @ValidateIf((it) => it.school)
  @MinLength(1)
  @MaxLength(64)
  school?: string;

  @ValidateIf((it) => it.website)
  @MinLength(1)
  website?: string;

  @ValidateIf((it) => it.twitter)
  @MinLength(1)
  @MaxLength(32)
  twitter?: string;

  @ValidateIf((it) => it.bio)
  @MinLength(1)
  @MaxLength(255)
  bio?: string;

  @ValidateIf((it) => it.gender)
  @MinLength(1)
  @MaxLength(64)
  gender?: string;

  @ValidateIf((it) => it.languages)
  @ValidateNested({
    each: true,
  })
  languages?: Language[];

  @ValidateIf((it) => it.wishToSpeak)
  @MinLength(1, {
    each: true,
  })
  @MaxLength(64, {
    each: true,
  })
  wishToSpeak?: string[];
}

export default UpdateUserDto;
