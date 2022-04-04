import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAlgoliaSearchIndex {
  @IsString()
  @IsNotEmpty()
  applicationId!: string;

  @IsString()
  @IsNotEmpty()
  adminKey!: string;
}
