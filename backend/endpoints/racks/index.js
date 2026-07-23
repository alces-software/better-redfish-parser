module.exports = require('express')
   .Router()
   // GET
   .get('/', require('./controllers/getAllRacks'))
   .get('/:id', require('./controllers/getRack'))

   // POST
   .post('/', require('./controllers/addRack'))

   // PUT
   .put('/:id', require('./controllers/updateRack'))

   // DELETE
   .delete('/:id', require('./controllers/deleteRack'));
