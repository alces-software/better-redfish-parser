require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rackRoutes = require('./routes/rack');

const app = express();

app.use(express.json());
app.use('/api/racks', rackRoutes);

mongoose
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
