import { Post, PostImage, Tag } from '@prisma/client';
import { LikeStatus } from './like-status.enum';

export type SinglePost = Post & {
  tags: Tag[];
  images: PostImage[];
  user: {
    id: number;
    username: string;
    name: string;
    image: string;
    verified: boolean;
    protected: boolean;
  };
  tagsCount: number;
  commentsCount: number;
  dislikesCount: number;
  likesCount: number;
  likeStatus: LikeStatus;
};
