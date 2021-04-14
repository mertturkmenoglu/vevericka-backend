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
} from 'routing-controllers';
import { Service } from 'typedi';
import IsAuth from '../middlewares/IsAuth';
import { Role } from '../role';
import CreateCommentDto from '../dto/CreateCommentDto';
import { Comment } from '../models/Comment';
import CommentService from '../services/CommentService';

@JsonController('/api/v2/comment')
@Service()
class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:id')
  @UseBefore(IsAuth)
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentService.getCommentById(id);

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    return comment;
  }

  @HttpCode(201)
  @Post('/')
  @UseBefore(IsAuth)
  @Authorized(Role.CREATE_COMMENT)
  async createComment(@Body() dto: CreateCommentDto) {
    const post = await this.commentService.getPostById(dto.postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const comment = new Comment({
      postId: post.id,
      createdBy: dto.createdBy,
      content: dto.content,
    });

    const savedComment = await comment.save();
    post.comments = [...post.comments, savedComment.id];

    await post.save();
    return savedComment;
  }

  @HttpCode(204)
  @Delete('/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.DELETE_COMMENT)
  async deleteComment(@Param('id') id: string) {
    await this.commentService.deleteComment(id);
  }
}

export default CommentController;
