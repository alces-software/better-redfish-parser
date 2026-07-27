import swaggerJsDoc from 'swagger-jsdoc';

export default swaggerJsDoc({
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Better Redfish Parser API',
         version: '1.0.0',
         description: 'API documentation for the Better Redfish Parser backend'
      }
   },
   apis: [`${__dirname}/api/**/*.js`, `${__dirname}/assets/models/*.js`]
});
