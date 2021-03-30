const getToken = (authHeader: string): string | null => {
  const parts = authHeader.split(' ');

  if (parts.length === 2 || parts[0] === 'Bearer') {
    return parts[0];
  }

  return null;
};

export default getToken;
