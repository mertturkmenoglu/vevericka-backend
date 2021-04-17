import { MinLength } from 'class-validator';

class CreateChatDto {
  @MinLength(1)
  chat!: string;

  @MinLength(1)
  chatName!: string;
}

export default CreateChatDto;
