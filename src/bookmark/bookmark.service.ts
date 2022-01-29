import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkService {
  async testFunction(str: string) {
    return str;
  }
}
