import { ConnectOptions } from 'mongoose';

const mongooseOptions: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export default {
  mongooseOptions
};
