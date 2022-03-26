import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UnfollowUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  thisUsername!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  otherUsername!: string;
}
