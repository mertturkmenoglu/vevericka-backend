import 'reflect-metadata';

import fs from 'fs';
import path from 'path';

import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI, { JsonObject } from 'swagger-ui-express';
import yaml from 'js-yaml';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';

import MongoConfig from './configs/MongoConfig';
import MorganConfig from './configs/MorganConfig';
import ApplicationConfig from './configs/ApplicationConfig';

import Log from './utils/Log';
import Authorization from './middlewares/Authorization';
import ApplicationModule from './ApplicationModule';
import SwaggerConfig from './configs/SwaggerConfig';

// Load environment variables
dotenvSafe.config();

// Read port information
const PORT = process.env.PORT || ApplicationConfig.DEFAULT_PORT;

// Linking TypeDI and routing controllers
useContainer(Container);

// Initialize server as a standard Express app
const app = express();

// Set trust proxy value to 1 to enable rate limiting
app.set('trust proxy', ApplicationConfig.TRUST_PROXY);

// Initialize Express middlewares
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    exposedHeaders: ApplicationConfig.EXPOSED_HEADERS,
  }),
);
app.use(morgan(MorganConfig.morganFormat));

const main = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI as string, MongoConfig.mongooseOptions);

  // Initialize routing controllers
  useExpressServer(app, {
    authorizationChecker: Authorization,
    classToPlainTransformOptions: {
      enableCircularCheck: ApplicationConfig.IS_CIRCULAR_CHECK_ENABLED,
    },
    controllers: ApplicationModule.controllers,
  });

  const filePath = path.join(__dirname, SwaggerConfig.SWAGGER_FILENAME);
  const swaggerDocument = yaml.load(fs.readFileSync(filePath, 'utf-8')) as JsonObject;

  // Enable Swagger Documentation at /docs route
  app.use(
    SwaggerConfig.SWAGGER_ROUTE,
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      explorer: SwaggerConfig.IS_EXPLORER_ENABLED,
    }),
  );

  // Start listening
  app.listen(PORT, () => {
    Log.i(`Server started on port ${PORT}`);
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
