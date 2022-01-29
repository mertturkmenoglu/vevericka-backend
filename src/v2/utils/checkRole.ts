import { Request } from 'express';
import { mapRoleToFn, Role } from '../role';

// eslint-disable-next-line import/prefer-default-export
export const checkRole = async (
  req: Request,
  role: Role,
  username: string,
  userId: string,
): Promise<boolean> => {
  const fn = mapRoleToFn[role];
  return fn(req, username, userId);
};
