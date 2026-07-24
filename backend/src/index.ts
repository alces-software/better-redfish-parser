import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Setup api
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Load endpoints
import api from './api';
app.use('/api', api);

// Load trpc endpoints
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
app.use(
   '/trpc',
   createExpressMiddleware({
      router: appRouter
   })
);

// Connect to the database
mongoose
   .connect(process.env.MONGO_URI || '', {
      dbName: process.env.MONGO_DATABASE
   })
   .then(() => {
      console.log('MongoDB connected');

      app.listen(process.env.PORT, () => {
         console.log(`Server running on port ${process.env.PORT}`);
      });
   })
   .catch((err) => {
      console.error('Database connection failed:', err);
   });
