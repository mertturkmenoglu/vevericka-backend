import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { Bookmark } from '../../models/Bookmark';
import { AuthorizationType, AuthValidateFn } from './types';
import { User } from '../../models/User';

const roles: Record<AuthorizationType, AuthValidateFn> = {
  'update-user': async (r) => r.body.username,
  'unfollow-user': async (r) => r.body.thisUsername,
  'follow-user': async (r) => r.body.thisUsername,
  'create-post': async (r) => {
    const id = r.body.createdBy;
    const user = await User.findById(id);
    if (!user) {
      return undefined;
    }
    return user.username;
  },
  'fetch-user-feed': async (r) => {
    const { username } = r.params;
    return username;
  },
  'delete-post': async (r) => {
    const postId = r.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return undefined;
    }
    const user = await User.findById(post.createdBy);
    if (!user) {
      return undefined;
    }
    return user.username;
  },
  'delete-comment': async (r) => {
    const commentId = r.params.id;
    const comment = await Comment.findById(commentId);
    return comment ? comment.createdBy : undefined;
  },
  'create-comment': async (r) => {
    const user = await User.findById(r.body.createdBy);
    if (!user) {
      return undefined;
    }
    return user.username;
  },
  'create-bookmark': async (r) => {
    const user = await User.findById(r.body.belongsTo);
    if (!user) {
      return undefined;
    }
    return user.username;
  },
  'get-bookmark': async (r) => {
    const bookmark = await Bookmark.findById(r.params.id);
    if (!bookmark) {
      return undefined;
    }
    const user = await User.findById(bookmark.belongsTo);
    if (!user) {
      return undefined;
    }
    return user.username;
  },
  'get-user-bookmarks': async (r) => r.params.username,
  'delete-bookmark': async (r) => {
    const bookmark = await Bookmark.findById(r.params.id);
    if (!bookmark) {
      return undefined;
    }
    const user = await User.findById(bookmark.belongsTo);
    if (!user) {
      return undefined;
    }
    return user.username;
  },
  'create-chat': async (r) => {
    const { createdBy } = r.body;

    const user = await User.findById(createdBy);
    if (!user) {
      return undefined;
    }

    return user.username;
  },
  'get-chat': async (r) => r.body.username,
};

export default roles;
