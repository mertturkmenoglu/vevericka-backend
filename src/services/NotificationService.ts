import { Service } from 'typedi';
import NotificationRepository from '../repositories/NotificationRepository';
import UserRepository from '../repositories/UserRepository';
import CreateNotificationDto from '../dto/CreateNotificationDto';
import UpdateNotificationDto from '../dto/UpdateNotificationDto';

@Service()
class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getNotification(id: string) {
    return this.notificationRepository.getNotificationById(id);
  }

  async getNotifications(username: string) {
    const user = await this.userRepository.findUserByUsernameSafe(username);
    if (!user) {
      return null;
    }

    return this.notificationRepository.getNotifications(user.id);
  }

  async addNotification(dto: CreateNotificationDto) {
    return this.notificationRepository.createNotification(dto);
  }

  async updateNotification(id: string, dto: UpdateNotificationDto) {
    return this.notificationRepository.updateNotification(id, dto);
  }

  async deleteNotification(id: string) {
    await this.notificationRepository.deleteNotification(id);
  }
}

export default NotificationService;
