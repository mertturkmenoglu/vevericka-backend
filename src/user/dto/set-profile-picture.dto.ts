import { IsUrl } from 'class-validator';

export class SetProfilePictureDto {
  @IsUrl()
  url!: string;
}
