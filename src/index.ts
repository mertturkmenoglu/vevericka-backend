import express from 'express';
import dotenvSafe from 'dotenv-safe';
import mongoose from 'mongoose';

import mongooseOptions from './configs/MongoConfig';

dotenvSafe.config();

const app = express();

mongoose.connect(process.env.MONGO_URI as string, mongooseOptions, () => {
  console.log('Connected to MongoDB');
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
