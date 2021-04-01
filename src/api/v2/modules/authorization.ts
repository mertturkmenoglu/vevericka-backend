import { Request, Response, NextFunction } from 'express';
import { Comment } from '../../../models/Comment';
import { Post } from '../../../models/Post';

import err from '../../../utils/err';
import getTokenFromHeader from '../../../utils/getTokenFromHeader';
import HttpCodes from '../../../utils/HttpCodes';
import isAuthorized from '../../../utils/isAuthorized';

type AuthorizationType =
  | 'follow-user'
  | 'unfollow-user'
  | 'update-user'
  | 'fetch-user-feed'
  | 'create-post'
  | 'delete-post'
  | 'delete-comment'
  | 'create-comment';

const authorize = async (
  authorizationType: AuthorizationType,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (authorizationType === 'follow-user' || authorizationType === 'unfollow-user') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.body.thisUsername);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'update-user') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.body.username);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'fetch-user-feed') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.params.username);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'create-post') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.body.createdBy);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'delete-post') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(HttpCodes.NOT_FOUND)
        .json(err('Post not found', HttpCodes.NOT_FOUND));
    }

    const auth = isAuthorized(token, post.createdBy);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'delete-comment') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(HttpCodes.NOT_FOUND)
        .json(err('Comment not found', HttpCodes.NOT_FOUND));
    }

    const auth = isAuthorized(token, comment.createdBy);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  if (authorizationType === 'create-comment') {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    const auth = isAuthorized(token, req.body.createdBy);
    if (!auth) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json(err('Unauthorized', HttpCodes.UNAUTHORIZED));
    }

    return next();
  }

  return res
    .status(HttpCodes.INTERNAL_SERVER_ERROR)
    .json(err('Unknown authorization type', HttpCodes.INTERNAL_SERVER_ERROR));
};

export default authorize;
