import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import expresStatusMonitor from 'express-status-monitor';

import mongooseOptions from './configs/MongoConfig';
import morganConfig from './configs/MorganConfig';
import applicationConfig from './configs/ApplicationConfig';
import appV2Routes from './api/v2/routes';
import Log from './utils/Log';
import IS_DEV from './utils/isDev';
import errorHandler from './utils/errorHandler';

// Load environment variables
dotenvSafe.config();

const app = express();
const PORT = process.env.PORT || applicationConfig.PORT;

// Connect to Redis
const redis = new Redis(process.env.REDIS_URL as string);

// Rate limiters
const rateLimiter = {
  register: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 10,
  }),
  login: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 10,
  }),
};

const main = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI as string, mongooseOptions);
};

// Application values
app.set('trust proxy', 1);

// Middlewares
if (IS_DEV) {
  app.use(expresStatusMonitor());
}

app.use(express.json());
app.use(helmet());
app.use(cors({
  exposedHeaders: ['authorization'],
}));
app.use(morgan(morganConfig));

// Application routes
app.use('/api/v2', appV2Routes);

// Error handler
app.use(errorHandler);

main().then(() => {
  app.listen(PORT, () => {
    Log.i(`Server started on port ${PORT}`);
  });
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

export default {
  redis,
  rateLimiter,
};
