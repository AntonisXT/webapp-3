
// backend/docs.js
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

module.exports = (app) => {
  const options = {
    definition: {
    openapi: '3.0.0',
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    security: [{ bearerAuth: [] }],
      openapi: '3.0.0',
      info: { title: 'El Greco API', version: '1.0.0' }
    },
    apis: ['./routes/*.js']
  };
  const spec = swaggerJsdoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
};
