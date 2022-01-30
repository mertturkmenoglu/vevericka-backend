import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { ContentfulService } from './contentful.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, ContentfulService],
})
// eslint-disable-next-line prettier/prettier
export class BlogModule { }
