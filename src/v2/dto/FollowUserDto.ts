import { MinLength } from 'class-validator';

class FollowUserDto {
  @MinLength(1)
  thisUsername!: string;

  @MinLength(1)
  otherUsername!: string;
}

export default FollowUserDto;
