import {
  Authorized,
  BadRequestError,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  QueryParam,
  UseBefore,
  UseInterceptor,
} from 'routing-controllers';
import { Service } from 'typedi';
import IsAuth from '../middlewares/IsAuth';
import { Role } from '../role';

import { DocumentToJsonInterceptor } from '../interceptors/DocumentToJsonInterceptor';
import NotificationService from '../services/NotificationService';
import CreateNotificationDto from '../dto/CreateNotificationDto';
import UpdateNotificationDto from '../dto/UpdateNotificationDto';

@JsonController('/api/v2/notifications')
@UseInterceptor(DocumentToJsonInterceptor)
@Service()
class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_NOTIFICATION)
  async getNotificationById(@QueryParam('id') id: string) {
    const notification = await this.notificationService.getNotification(id);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    return notification;
  }

  @Get('/user/:username')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_NOTIFICATIONS)
  async getNotificationsByUsername(@Param('username') username: string) {
    const notifications = await this.notificationService.getNotifications(username);

    if (!notifications) {
      throw new NotFoundError();
    }

    return notifications;
  }

  @HttpCode(201)
  @Post('/')
  @UseBefore(IsAuth)
  @Authorized(Role.CREATE_NOTIFICATION)
  async createNotification(@Body() dto: CreateNotificationDto) {
    const notification = await this.notificationService.addNotification(dto);

    if (!notification) {
      throw new BadRequestError();
    }

    return notification;
  }

  @Put('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.UPDATE_NOTIFICATION)
  async updateNotification(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    const notification = await this.notificationService.updateNotification(id, dto);

    if (!notification) {
      throw new BadRequestError();
    }

    return notification;
  }

  @Delete('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.DELETE_NOTIFICATION)
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
    return {
      message: 'Notification deleted',
    };
  }
}

export default NotificationController;
