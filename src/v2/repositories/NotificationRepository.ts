import { Service } from 'typedi';
import { Notification } from '../models/Notification';
import CreateNotificationDto from '../dto/CreateNotificationDto';
import UpdateNotificationDto from '../dto/UpdateNotificationDto';

@Service()
class NotificationRepository {
  async getNotificationById(id: string) {
    try {
      return await Notification.findById(id)
        .populate('origin', 'name username image')
        .populate('target', 'name username image');
    } catch (e) {
      return null;
    }
  }

  async getNotifications(userId: string) {
    try {
      return await Notification.find({ target: userId })
        .populate('origin', 'name username image')
        .populate('target', 'name username image')
        .sort({ createdAt: -1 });
    } catch (e) {
      return null;
    }
  }

  async createNotification(dto: CreateNotificationDto) {
    try {
      return await new Notification({
        origin: dto.origin,
        target: dto.target,
        type: dto.type,
        delivered: false,
        metadata: dto.metadata,
      }).save();
    } catch (e) {
      return null;
    }
  }

  async updateNotification(id: string, dto: UpdateNotificationDto) {
    try {
      return await Notification.findByIdAndUpdate(id, {
        delivered: dto.delivered,
        deliveredAt: new Date(),
      });
    } catch (e) {
      return null;
    }
  }

  async deleteNotification(id: string) {
    await Notification.findByIdAndDelete(id);
  }
}

export default NotificationRepository;
