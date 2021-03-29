import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import mongooseOptions from './configs/MongoConfig';
import morganConfig from './configs/MorganConfig';
import applicationConfig from './configs/ApplicationConfig';
import appV2Routes from './routes/v2';

// Load environment variables
dotenvSafe.config();

const app = express();
const PORT = process.env.PORT || applicationConfig.PORT;

mongoose.connect(process.env.MONGO_URI as string, mongooseOptions, () => {
  console.log('Connected to MongoDB');
});

// Application values
app.set('trust proxy', 1);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan(morganConfig));

// Application routes
app.use('/api/v2', appV2Routes);

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default {
  server,
};
