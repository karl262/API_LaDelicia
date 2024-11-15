const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Configuración de Swagger
const options = {
definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Ventas', // Título de la documentación
      version: '1.0.0',       // Versión de la API
    description: 'Documentación de API de Ventas',
    },
    servers: [
    {
        url: 'http://localhost:'+process.env.PORT , // URL base del servidor de la API
    },
    ],
},
  apis: ['./src/routes/*.js'], // Rutas donde están tus archivos de rutas para generar la documentación automáticamente
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
app.use('/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));
console.log('Swagger docs available at http://localhost:'+
    process.env.PORT+'/api-docs');
};

module.exports = swaggerDocs;