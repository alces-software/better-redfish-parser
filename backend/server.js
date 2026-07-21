// Load .env
require('dotenv').config();

// Import functions
const express = require('express'),
   { readdirSync } = require('node:fs');

// Setup express
const app = express();
app.use(express.json());

// Load Endpoints
const router = express.Router();
app.use(router);

const routes = [];
readdirSync(`${__dirname}/endpoints`).forEach((dir) => {
   readdirSync(`${__dirname}/endpoints/${dir}`).forEach((endpoint) => {
      const { info, call } = require(`./endpoints/${dir}/${endpoint}`);
      const path = `/${dir}${info.endpoint || ''}`;
      routes.push({
         method: info.method.toLowerCase(),
         path,
         call
      });
   });
});

routes
   .map((route) => ({
      ...route,
      score: route.path
         .split('/')
         .filter(Boolean)
         .reduce((total, segment) => {
            if (segment.startsWith(':')) return total;
            if (segment.includes('*')) return -10;
            return total + 10;
         }, 0)
   }))
   .sort((a, b) => b.score - a.score)
   .forEach(({ method, path, call }) => {
      router[method](`/api${path.startsWith('/') ? path : `/${path}`}`, call);
   });

// Connect to the database
require('mongoose')
   .connect(process.env.MONGO_URI, {
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
