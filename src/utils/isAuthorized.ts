import jwt from 'jsonwebtoken';

const isAuthorized = (token: string, username: string): boolean => {
  if (!token) {
    return false;
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!verified) {
    return false;
  }

  if (typeof verified !== 'object' || !('username' in verified)) {
    return false;
  }

  const { username: tokenUsername } = verified as { username: string };

  if (tokenUsername === username) {
    return true;
  }

  return false;
};

export default isAuthorized;
