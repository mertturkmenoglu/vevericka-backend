import { Service } from 'typedi';
import UserRepository from '../repositories/UserRepository';
import MessageRepository from '../repositories/MessageRepository';

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
}

export default MessageService;
