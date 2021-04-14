import { MinLength } from 'class-validator';

class CreateBookmarkDto {
  @MinLength(1)
  postId!: string;

  @MinLength(1)
  belongsTo!: string;
}

export default CreateBookmarkDto;
