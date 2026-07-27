import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Setup api
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Load endpoints
import { appRouter } from './trpc';

import { createOpenApiExpressMiddleware } from 'trpc-to-openapi';
app.use(
   '/api',
   createOpenApiExpressMiddleware({
      router: appRouter
   })
);

import { createExpressMiddleware } from '@trpc/server/adapters/express';
app.use(
   '/trpc',
   createExpressMiddleware({
      router: appRouter
   })
);

// Setup api docs
import swaggerUi from 'swagger-ui-express';
import openApiDocument from './openapi';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

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
