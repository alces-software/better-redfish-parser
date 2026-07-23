module.exports = require('express')
   .Router()
   .use('/assets', require('./assets'))
   .use('/racks', require('./racks'));
