module.exports = require('express')
   .Router()
   // GET
   .get('/', require('./controllers/getAllLatestAssets'))
   .get('/:uuid/history', require('./controllers/getAssetHistory'))
   .get('/:uuid', require('./controllers/getLatestAsset'))

   // POST
   .post('/', require('./controllers/addAsset'))
   .post('/:uuid', require('./controllers/AddAssetVersion'))

   // DELETE
   .delete('/:uuid', require('./controllers/deleteAsset'));
