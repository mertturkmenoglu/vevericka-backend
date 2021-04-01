/* eslint-disable no-unused-vars */
import { Request } from 'express';

export type AuthValidateFn = (r: Request) => Promise<string | undefined>;

export type DtoValidationFn = (o: object) => Promise<boolean>;

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

export type DtoType =
  | 'register'
  | 'login'
  | 'send-password-reset-email'
  | 'reset-password'
  | 'follow-user'
  | 'unfollow-user'
  | 'update-user'
  | 'create-post'
  | 'create-comment'
  | 'create-bookmark';
