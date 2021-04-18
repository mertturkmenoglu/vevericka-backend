import { Service } from 'typedi';
import UserRepository from '../repositories/UserRepository';
import MessageRepository from '../repositories/MessageRepository';
import CreateMessageDto from '../dto/CreateMessageDto';
import UpdateChatNameDto from '../dto/UpdateChatNameDto';

@Service()
class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getChatById(id: string) {
    return this.messageRepository.getChatById(id);
  }

  async userExistsByUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findUserByUsernameSafe(username);
    return user !== null;
  }

  async getUserChats(username: string) {
    const user = await this.userRepository.findUserByUsernameSafe(username);
    if (!user) {
      return [];
    }
    return this.messageRepository.getUserChats(user.id);
  }

  async areUsersValid(users: string[]): Promise<boolean> {
    const result = await Promise.all(
      users.map((userId) => this.userRepository.findUserByIdSafe(userId)),
    );
    return !result.includes(null);
  }

  async createMessage(dto: CreateMessageDto) {
    const message = await this.messageRepository.addMessage(dto);

    if (!message) {
      return null;
    }

    const result = await this.messageRepository.updateChatLastMessage(message);

    if (!result) {
      return null;
    }

    return message;
  }

  async getChatMessages(chatId: string) {
    return this.messageRepository.getChatMessages(chatId);
  }

  async changeChatName(dto: UpdateChatNameDto) {
    return this.messageRepository.updateChatName(dto.chat, dto.chatName);
  }
}

export default MessageService;
