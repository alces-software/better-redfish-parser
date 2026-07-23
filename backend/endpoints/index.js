module.exports = require('express')
   .Router()
   .use('/assets', require('./assets'))
   .use('/enums', require('./enums'))
   .use('/racks', require('./racks'));
