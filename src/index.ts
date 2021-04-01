import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Redis from 'ioredis';
import expresStatusMonitor from 'express-status-monitor';

import mongooseOptions from './configs/MongoConfig';
import morganConfig from './configs/MorganConfig';
import applicationConfig from './configs/ApplicationConfig';
import appV2Routes from './api/v2/routes';
import Log from './utils/Log';
import IS_DEV from './utils/isDev';

// Load environment variables
dotenvSafe.config();

const app = express();
const PORT = process.env.PORT || applicationConfig.PORT;

// Connect to Redis
const redis = new Redis();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string, mongooseOptions, () => {
  console.log('Connected to MongoDB');
});

// Application values
app.set('trust proxy', 1);

// Middlewares
if (IS_DEV) {
  app.use(expresStatusMonitor());
}

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan(morganConfig));

// Application routes
app.use('/api/v2', appV2Routes);

const server = app.listen(PORT, () => {
  Log.i(`Server started on port ${PORT}`);
});

export default {
  server,
  redis,
};
