import {
  Authorized,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
  UseBefore,
  UseInterceptor,
} from 'routing-controllers';
import { Service } from 'typedi';
import IsAuth from '../middlewares/IsAuth';
import { Role } from '../role';
import { User } from '../models/User';
import { Bookmark } from '../models/Bookmark';
import CreateBookmarkDto from '../dto/CreateBookmarkDto';
import BookmarkService from '../services/BookmarkService';
import { DocumentToJsonInterceptor } from '../interceptors/DocumentToJsonInterceptor';

@JsonController('/api/v2/bookmark')
@UseInterceptor(DocumentToJsonInterceptor)
@Service()
class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_BOOKMARK)
  async getBookmarkById(@Param('id') id: string) {
    const bookmark = await this.bookmarkService.getBookmarkById(id);

    if (!bookmark) {
      throw new NotFoundError('Bookmark not found');
    }

    return bookmark;
  }

  @Get('/user/:username')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_USER_BOOKMARKS)
  async getUserBookmarks(@Param('username') username: string) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const bookmarks = await this.bookmarkService.getUserBookmarks(user.id);

    if (!bookmarks) {
      throw new NotFoundError('Bookmarks not found');
    }

    return bookmarks;
  }

  @HttpCode(201)
  @Post('/')
  @UseBefore(IsAuth)
  @Authorized(Role.CREATE_BOOKMARK)
  async createBookmark(@Body() dto: CreateBookmarkDto) {
    const post = await this.bookmarkService.getPostById(dto.postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const bookmark = new Bookmark({
      postId: post.id,
      belongsTo: dto.belongsTo,
    });

    return bookmark.save();
  }

  @HttpCode(204)
  @Delete('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.DELETE_BOOKMARK)
  async deleteBookmark(@Param('id') id: string) {
    await Bookmark.findByIdAndDelete(id);
  }
}

export default BookmarkController;
