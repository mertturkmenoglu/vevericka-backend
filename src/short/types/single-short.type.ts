import { Short } from '@prisma/client';
import { MinimalUserResponse } from 'src/types/MinimalUserResponse';

export type SingleShort = Short & {
  user: MinimalUserResponse;
};
