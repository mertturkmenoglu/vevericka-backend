import { Service } from 'typedi';
import UserRepository from '../repositories/UserRepository';
import { UserDocument } from '../models/User';
import NotificationRepository from '../repositories/NotificationRepository';
import { NotificationType } from '../models/Notification';

@Service()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return this.userRepository.findUserByUsernameSafe(username);
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findUserByIdSafe(id);
  }

  async searchUsers(query: string) {
    return this.userRepository.searchUsers(query);
  }

  async getUserByUsernameNotPopulated(username: string): Promise<UserDocument | null> {
    return this.userRepository.findUserByUsernameSafeNotPopulated(username);
  }

  async createFollowNotification(
    thisUserUsername: string,
    thisUserId: string,
    otherUserId: string,
  ) {
    await this.notificationRepository.createNotification({
      origin: thisUserId,
      target: otherUserId,
      type: NotificationType.ON_USER_FOLLOW,
      metadata: thisUserUsername,
    });
  }
}

export default UserService;
