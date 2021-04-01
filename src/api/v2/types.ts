/* eslint-disable no-unused-vars */
import { Request } from 'express';

export type AuthValidateFn = (r: Request) => Promise<string | undefined>;

export type AuthorizationType =
  | 'follow-user'
  | 'unfollow-user'
  | 'update-user'
  | 'fetch-user-feed'
  | 'create-post'
  | 'delete-post'
  | 'delete-comment'
  | 'create-comment'
  | 'get-bookmark'
  | 'get-user-bookmarks'
  | 'delete-bookmark'
  | 'create-bookmark';
