import { IsEnum, MinLength } from 'class-validator';
import { NotificationType } from '../models/Notification';

class CreateNotificationDto {
  @MinLength(1)
  origin!: string;

  @MinLength(1)
  target!: string;

  @MinLength(1)
  @IsEnum(NotificationType)
  type!: string;

  metadata?: string;
}

export default CreateNotificationDto;
