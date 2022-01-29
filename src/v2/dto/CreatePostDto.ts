import { MaxLength, MinLength } from 'class-validator';

class CreatePostDto {
  @MinLength(1)
  createdBy!: string;

  @MinLength(1)
  @MaxLength(255)
  content!: string;
}

export default CreatePostDto;
