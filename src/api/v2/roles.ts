import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { Bookmark } from '../../models/Bookmark';
import { AuthorizationType, AuthValidateFn } from './types';

const roles: Record<AuthorizationType, AuthValidateFn> = {
  'update-user': async (r) => r.body.username,
  'unfollow-user': async (r) => r.body.thisUsername,
  'follow-user': async (r) => r.body.thisUsername,
  'create-post': async (r) => r.body.createdBy,
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

    return post.createdBy;
  },
  'delete-comment': async (r) => {
    const commentId = r.params.id;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return undefined;
    }

    return comment.createdBy;
  },
  'create-comment': async (r) => r.body.createdBy,
  'create-bookmark': async (r) => r.body.belongsTo,
  'get-bookmark': async (r) => {
    const bookmark = await Bookmark.findById(r.params.id);

    if (!bookmark) {
      return undefined;
    }

    return bookmark.belongsTo;
  },
  'get-user-bookmarks': async (r) => r.params.username,
  'delete-bookmark': async (r) => {
    const bookmark = await Bookmark.findById(r.params.id);

    if (!bookmark) {
      return undefined;
    }

    return bookmark.belongsTo;
  },
};

export default roles;
