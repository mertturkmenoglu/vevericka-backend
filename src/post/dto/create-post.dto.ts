import { IsLowercase, MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';
import { UserConstraints } from '../../user/user.entity';

export class CreatePostDto {
  @MaxLength(UserConstraints.username.max)
  @MinLength(UserConstraints.username.min)
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  username!: string;

  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  content!: string;
}
