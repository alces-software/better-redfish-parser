module.exports = require('express')
   .Router()
   // GET
   .get('/system', require('./controllers/getSystemTypes'));
