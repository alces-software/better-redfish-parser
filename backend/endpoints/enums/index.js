module.exports = require('express')
   .Router()
   // GET
   .get('/manufacturers', require('./controllers/getManufacturers'));
