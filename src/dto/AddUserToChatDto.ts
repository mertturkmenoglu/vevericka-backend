import { MinLength } from 'class-validator';

class AddUserToChatDto {
  @MinLength(1)
  chatId!: string;

  @MinLength(1)
  userId!: string;
}

export default AddUserToChatDto;
