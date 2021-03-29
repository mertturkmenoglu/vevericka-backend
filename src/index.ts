import express from 'express';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config();

const app = express();

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
