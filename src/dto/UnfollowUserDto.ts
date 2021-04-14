import { MinLength } from 'class-validator';

class UnfollowUserDto {
  @MinLength(1)
  thisUsername!: string;

  @MinLength(1)
  otherUsername!: string;
}

export default UnfollowUserDto;
