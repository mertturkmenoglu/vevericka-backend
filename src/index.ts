import 'reflect-metadata';

import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import mongooseOptions from './configs/MongoConfig';
import morganConfig from './configs/MorganConfig';
import applicationConfig from './configs/ApplicationConfig';

import Log from './utils/Log';
import errorHandler from './utils/errorHandler';
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import Authorization from './middlewares/Authorization';
import PostController from './controllers/PostController';
import BookmarkController from './controllers/BookmarkController';
import CommentController from './controllers/CommentController';

// Load environment variables
dotenvSafe.config();

// Read port information
const PORT = process.env.PORT || applicationConfig.PORT;

// Linking TypeDI and routing controllers
useContainer(Container);

// Initialize server as a standard Express app
const app = express();

// Set trust proxy value to 1 to enable rate limiting
app.set('trust proxy', 1);

// Initialize Express middlewares
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    exposedHeaders: ['authorization'],
  }),
);
app.use(morgan(morganConfig));

// Error handler
app.use(errorHandler);

const main = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI as string, mongooseOptions);

  // Initialize routing controllers
  useExpressServer(app, {
    authorizationChecker: Authorization,
    controllers: [
      AuthController,
      UserController,
      PostController,
      BookmarkController,
      CommentController,
    ],
  });

  // Start listening
  app.listen(PORT, () => {
    Log.i(`Server started on port ${PORT}`);
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
