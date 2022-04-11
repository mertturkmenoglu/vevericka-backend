import { Tag } from '@prisma/client';

export type TagWithCount = Tag & {
  _count: {
    posts: number;
  };
};
