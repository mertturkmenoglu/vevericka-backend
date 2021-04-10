import Redis from 'ioredis';

// eslint-disable-next-line import/prefer-default-export
export const redis = new Redis(process.env.REDIS_URL as string);
