import jwt from 'jsonwebtoken';

import { Action } from 'routing-controllers';
import getToken from '../utils/getToken';
import { checkRole } from '../utils/checkRole';
import { Role } from '../role';

const Authorization = async (action: Action, roles: Role[]) => {
  const token = getToken(action.request.headers.authorization);
  if (!token) return false;

  const verified = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!verified) {
    return false;
  }

  const { username, userId } = verified as any;

  if (!username || !userId) {
    return false;
  }

  // noinspection UnnecessaryLocalVariableJS
  const isAuthorized: boolean = await checkRole(action.request, roles[0], username, userId);
  return isAuthorized;
};

export default Authorization;
