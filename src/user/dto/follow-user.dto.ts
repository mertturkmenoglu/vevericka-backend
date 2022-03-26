import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FollowUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  thisUsername!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  otherUsername!: string;
}
