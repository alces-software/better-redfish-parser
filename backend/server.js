// Load .env
require('dotenv').config();

// Import functions
const express = require('express'),
   swaggerUi = require('swagger-ui-express'),
   swaggerSpec = require('./swagger'),
   cors = require('cors');

// Setup express
const app = express();
app.use(express.json());
app.use(cors());

// Load Endpoints
app.use('/api', require('./endpoints'));

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

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
