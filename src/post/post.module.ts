import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
