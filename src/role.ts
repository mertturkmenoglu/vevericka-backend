import { Request } from 'express';
import { Post } from './models/Post';
import { Comment } from './models/Comment';
import { Bookmark } from './models/Bookmark';

// noinspection JSUnusedGlobalSymbols
export enum Role {
  FOLLOW_USER = 'FOLLOW_USER',
  UNFOLLOW_USER = 'UNFOLLOW_USER',
  UPDATE_USER = 'UPDATE_USER',
  FETCH_USER_FEED = 'FETCH_USER_FEED',
  CREATE_POST = 'CREATE_POST',
  DELETE_POST = 'DELETE_POST',
  DELETE_COMMENT = 'DELETE_COMMENT',
  CREATE_COMMENT = 'CREATE_COMMENT',
  GET_BOOKMARK = 'GET_BOOKMARK',
  GET_USER_BOOKMARKS = 'GET_USER_BOOKMARKS',
  DELETE_BOOKMARK = 'DELETE_BOOKMARK',
  CREATE_BOOKMARK = 'CREATE_BOOKMARK',
  CREATE_CHAT = 'CREATE_CHAT',
  GET_CHAT = 'GET_CHAT',
  GET_USER_CHATS = 'GET_USER_CHATS',
  GET_CHAT_MESSAGES = 'GET_CHAT_MESSAGES',
}

type AuthFn = (req: Request, username: string, userId: string) => Promise<boolean>;

export const mapRoleToFn: Record<Role, AuthFn> = {
  FOLLOW_USER: async (r, username) => r.body.thisUsername === username,
  UNFOLLOW_USER: async (r, username) => r.body.thisUsername === username,
  UPDATE_USER: async (r, username) => r.body.username === username,
  CREATE_POST: async (r, _username, userId) => r.body.createdBy === userId,
  FETCH_USER_FEED: async (r, username) => r.params.username === username,
  DELETE_POST: async (r, _username, userId) => {
    const postId = r.params.id;
    const post = await Post.findById(postId);

    if (!post) return false;

    return post.createdBy === userId;
  },
  DELETE_COMMENT: async (r, _username, userId) => {
    const comment = await Comment.findById(r.params.id);
    if (!comment) return false;
    return comment.createdBy === userId;
  },
  CREATE_COMMENT: async (r, _username, userId) => r.body.createdBy === userId,
  CREATE_BOOKMARK: async (r, _username, userId) => r.body.belongsTo === userId,
  GET_BOOKMARK: async (r, _username, userId) => {
    const bookmark = await Bookmark.findById(r.params.id);
    if (!bookmark) return false;
    return bookmark.belongsTo === userId;
  },
  GET_USER_BOOKMARKS: async (r, username) => r.params.username === username,
  DELETE_BOOKMARK: async (r, _username, userId) => {
    const bookmark = await Bookmark.findById(r.params.id);
    if (!bookmark) return false;
    return bookmark.belongsTo === userId;
  },
  CREATE_CHAT: async (r, _username, userId) => r.body.createdBy === userId,
  GET_CHAT: async (r, username) => r.body.username === username,
  GET_USER_CHATS: async (r, username) => r.params.username === username,
  GET_CHAT_MESSAGES: async (r, username) => r.body.username === username,
};