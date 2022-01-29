import { MinLength } from 'class-validator';

class UpdateChatNameDto {
  @MinLength(1)
  chat!: string;

  @MinLength(1)
  chatName!: string;
}

export default UpdateChatNameDto;
