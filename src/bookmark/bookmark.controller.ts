import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@ApiTags('bookmark')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'bookmark'
})
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) { }

  @Get('/:id')
  async getBookmarkById(@Param('id') id: string) {
    return this.bookmarkService.testFunction(id);
  }

  @Get('/user/:username')
  async getUserBookmarks(@Param('username') username: string) {
    return username;
  }

  @Post('/')
  async createBookmark(@Body() dto: CreateBookmarkDto) {
    return dto;
  }

  @Delete('/:id')
  async deleteBookmarkById(@Param('id') id: string) {
    return id;
  }

  @Delete('/user/:username')
  async deleteUserbookmarks(@Param('username') username: string) {
    return username;
  }
}
