import { MinLength } from 'class-validator';

class RemoveUserFromChatDto {
  @MinLength(1)
  chatId!: string;

  @MinLength(1)
  userId!: string;
}

export default RemoveUserFromChatDto;
