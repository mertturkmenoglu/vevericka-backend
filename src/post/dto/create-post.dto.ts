import {
  IsLowercase,
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePostDto {
  @MaxLength(32)
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  username!: string;

  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsArray()
  @MinLength(1, {
    each: true,
  })
  @IsString({
    each: true,
  })
  @ArrayMaxSize(4)
  images!: string[];

  @IsArray()
  @MinLength(1, {
    each: true,
  })
  @IsString({
    each: true,
  })
  @ArrayMaxSize(2)
  videos!: string[];
}
