import { Prisma, User } from '@prisma/client';

export const minimalUserResponseSelect = Prisma.validator<Prisma.UserSelect>()({
  username: true,
  name: true,
  id: true,
  protected: true,
  verified: true,
  image: true,
});

type Keys = keyof typeof minimalUserResponseSelect;

export type MinimalUserResponse = Required<Pick<User, Keys>>;
