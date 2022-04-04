import { CacheModule, Module } from '@nestjs/common';
import { AlgoliaModule } from 'src/algolia/algolia.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CacheModule.register(), PrismaModule, AlgoliaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
