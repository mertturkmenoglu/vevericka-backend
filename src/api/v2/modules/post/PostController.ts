/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { Service } from 'typedi';

import PostService from './PostService';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import { Comment } from '../../../../models/Comment';
import CreateCommentDto from './dto/CreateCommentDto';

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
}

export default PostController;
