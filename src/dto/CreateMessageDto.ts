import { MinLength } from 'class-validator';

class CreateMessageDto {
  @MinLength(1)
  sender!: string;

  @MinLength(1)
  content!: string;

  @MinLength(1)
  chat!: string;
}

export default CreateMessageDto;
