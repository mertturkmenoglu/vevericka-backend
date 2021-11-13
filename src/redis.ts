import Redis from 'ioredis';
import dotenvSafe from 'dotenv-safe';

// Load environment variables
dotenvSafe.config();

const client = new Redis(process.env.REDIS_URL as string, {
  connectTimeout: 10000,
});

export default {
  client,
};
