import { Injectable } from '@nestjs/common';

@Injectable()
export class ExploreService {
  async testFunction() {
    return 'Explore';
  }
}
