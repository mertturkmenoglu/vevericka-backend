interface CreateChatDto {
  createdBy: string;
  users: string[];
  isGroupChat: boolean;
}

export default CreateChatDto;
