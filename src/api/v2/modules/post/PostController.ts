/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { Service } from 'typedi';

import PostService from './PostService';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import { User } from '../../../../models/User';
import { Comment } from '../../../../models/Comment';
import CreateCommentDto from './dto/CreateCommentDto';
import { Bookmark } from '../../../../models/Bookmark';
import CreateBookmarkDto from './dto/CreateBookmarkDto';

@Service()
class PostController {
  constructor(private readonly postService: PostService) {}

  async deleteComment(req: Request, res: Response) {
    const commentId = req.params.id;

    await Comment.findByIdAndDelete(commentId);
    return res.status(HttpCodes.NO_CONTENT).end();
  }

  async getCommentById(req: Request, res: Response) {
    const commentId = req.params.id;

    if (!commentId) {
      // throw new BadRequest('Invalid comment id');
    }

    const comment = await this.postService.getCommentById(commentId);

    if (!comment) {
      // throw new NotFound('Comment not found');
    }

    return res.json(response(comment));
  }

  async createComment(req: Request, res: Response) {
    const dto = req.body as CreateCommentDto;
    const post = await this.postService.getPostById(dto.postId);

    if (!post) {
      throw new NotFound('Post not found');
    }

    const comment = new Comment({
      postId: post.id,
      createdBy: dto.createdBy,
      content: dto.content,
    });

    const savedComment = await comment.save();
    post.comments = [...post.comments, savedComment.id];

    await post.save();
    return res.status(HttpCodes.CREATED).json(response(savedComment));
  }

  async getBookmarkById(req: Request, res: Response) {
    const bookmarkId = req.params.id;

    if (!bookmarkId) {
      throw new BadRequest('Invalid bookmark id');
    }

    const bookmark = await this.postService.getBookmarkById(bookmarkId);

    if (!bookmark) {
      throw new NotFound('Bookmark not found');
    }

    return res.json(response(bookmark));
  }

  async getUserBookmarks(req: Request, res: Response) {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFound('User not found');
    }

    const bookmarks = await this.postService.getUserBookmarks(user.id);

    if (!bookmarks) {
      throw new NotFound('Bookmarks not found');
    }

    return res.json(response(bookmarks));
  }

  async deleteBookmark(req: Request, res: Response) {
    const bookmarkId = req.params.id;

    if (!bookmarkId) {
      throw new BadRequest('Invalid bookmark id');
    }

    await Bookmark.findByIdAndDelete(bookmarkId);
    return res.status(HttpCodes.NO_CONTENT).end();
  }

  async createBookmark(req: Request, res: Response) {
    const dto = req.body as CreateBookmarkDto;
    const post = await this.postService.getPostById(dto.postId);

    if (!post) {
      throw new NotFound('Post not found');
    }

    const bookmark = new Bookmark({
      postId: post.id,
      belongsTo: dto.belongsTo,
    });

    const savedBookmark = await bookmark.save();
    return res.status(HttpCodes.CREATED).json(response(savedBookmark));
  }
}

export default PostController;
