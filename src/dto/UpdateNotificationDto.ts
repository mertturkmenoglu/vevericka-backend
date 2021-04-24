import { IsBoolean } from 'class-validator';

class UpdateNotificationDto {
  @IsBoolean()
  delivered!: boolean;
}

export default UpdateNotificationDto;
