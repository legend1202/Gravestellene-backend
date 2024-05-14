import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { handleGlobalError } from './src/utils/globalErrorHandler';
import routes from './src/routes';

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use('/uploads', express.static(path.join(__dirname, 'uploads/')));
app.use('/uploads', express.static(path.join(__dirname, './uploads/')));

if (!MONGODB_URI) {
  throw new Error(
    'No mongo connection string. Set MONGODB_URI environment variable.'
  );
}

const initMongo = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
  } catch (error) {
    console.log(`Could not connect to DB: ${error}`);
  }
};

const initServer = async () => {
  try {
    await initMongo();
    app.use(express.json());
    app.use(
      cors({
        origin: '*',
        exposedHeaders: 'location',
      })
    );
    app.use(routes);
    app.use(handleGlobalError);

    const server = app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });

    process.on('SIGTERM', () => {
      console.debug('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.debug('HTTP server closed');
      });
    });
  } catch (error) {
    console.log(`Could not start server: ${error}`);
  }
};

initServer();
