import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

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

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
app.use('/docs/sales/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));
console.log('Swagger docs available at http://localhost:3100/docs/sales/api-docs');
};

export default swaggerDocs;