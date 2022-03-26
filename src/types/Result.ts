import { HttpException } from '@nestjs/common';

export interface Result<T> {
  data?: T;
  exception?: HttpException;
}
