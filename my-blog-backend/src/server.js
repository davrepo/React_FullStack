import express from 'express';
import { connectDB } from './db';
import router from './routes';
import 'dotenv/config';

async function start() {
  await connectDB();

  const app = express();
  app.use(express.json());
  
  // Use the modularized routes
  app.use(router);

  app.listen(8000, () => {
    console.log('Server is listening on port 8000');
  });
}

start();
