const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio_Auths', // Título de la documentación
      version: '1.0.0',       // Versión de la API
      description: 'Documentación de micriservicio de Auths',
    },
    servers: [
      {
        url: 'http://localhost:'+process.env.PORT , // URL base del servidor de la API
      },
    ],
  },
  apis: ['./src/routes/authRoutes.js'], // Rutas donde están tus archivos de rutas para generar la documentación automáticamente
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/docs/auths/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:3100/docs/auths/api-docs');
};

module.exports = swaggerDocs;