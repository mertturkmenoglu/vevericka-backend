import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShortController } from './short.controller';
import { ShortService } from './short.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShortController],
  providers: [ShortService],
})
export class ShortModule {}
