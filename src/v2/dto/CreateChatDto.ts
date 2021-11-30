import { MinLength } from 'class-validator';

class CreateChatDto {
  @MinLength(1)
  createdBy!: string;

  @MinLength(1, {
    each: true,
  })
  users!: string[];

  isGroupChat!: boolean;
}

export default CreateChatDto;
