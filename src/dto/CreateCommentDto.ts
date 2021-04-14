import { Length, MinLength } from 'class-validator';

class CreateCommentDto {
  @MinLength(1)
  postId!: string;

  @MinLength(1)
  createdBy!: string;

  @Length(1, 255)
  content!: string;
}

export default CreateCommentDto;
