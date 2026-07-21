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

routes.sort((a, b) => {
   const score = (route) => {
      const segments = route.path.split('/').filter(Boolean);

      return segments.reduce((total, segment) => {
         if (segment.startsWith(':')) return total;
         if (segment.includes('*')) return -10;
         return total + 10;
      }, 0);
   };

   return score(b) - score(a);
}).forEach(({ method, path, call }) => {
   router[method](path, call);
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
