import { Profile } from './profile.type';

export type ProfileOmitted = Omit<Profile, 'isFollowedByThisUser' | 'isThisUser'>;
