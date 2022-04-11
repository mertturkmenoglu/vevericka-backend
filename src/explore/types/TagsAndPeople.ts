import { MinimalUserResponse } from 'src/types/MinimalUserResponse';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { TagWithCount } from './TagWithCount';

export type TagsAndPeople = {
  tags: PaginatedResults<TagWithCount[]>;
  people: PaginatedResults<MinimalUserResponse[]>;
};
