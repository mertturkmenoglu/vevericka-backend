import { Feature, Hobby, Speaking, User, WishToSpeak } from '@prisma/client';

export type Profile = Partial<User> & {
  speaking: Speaking[];
  wishToSpeak: WishToSpeak[];
  features: Feature[];
  hobbies: Hobby[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByThisUser: boolean;
  isThisUser: boolean;
};
