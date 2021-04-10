import 'reflect-metadata';

import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import mongooseOptions from './configs/MongoConfig';
import morganConfig from './configs/MorganConfig';
import applicationConfig from './configs/ApplicationConfig';

import Log from './utils/Log';
import errorHandler from './utils/errorHandler';
import apiV1Routes from './api/v1/routes';
import authRoutes from './api/v2/modules/auth/authRoutes';
import postRoutes from './api/v2/modules/post/postRoutes';
import userRoutes from './api/v2/modules/user/userRoutes';
import messageRoutes from './api/v2/modules/message/messageRoutes';

// Load environment variables
dotenvSafe.config();

const app = express();
const PORT = process.env.PORT || applicationConfig.PORT;

const main = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI as string, mongooseOptions);
};

// Application values
app.set('trust proxy', 1);

app.use(express.json());
app.use(helmet());
app.use(cors({
  exposedHeaders: ['authorization'],
}));
app.use(morgan(morganConfig));

// Application routes
app.use('/api/v1', apiV1Routes);
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/post', postRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/message', messageRoutes);

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
