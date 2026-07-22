const swaggerJSDoc = require('swagger-jsdoc');

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Better Redfish Parser API',
         version: '1.0.0',
         description: 'API documentation for the Better Redfish Parser backend'
      }
   },
   apis: [`${__dirname}/endpoints/**/*.js`, `${__dirname}/models/*.js`]
};

module.exports = swaggerJSDoc(options);
