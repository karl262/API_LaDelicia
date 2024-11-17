import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio_Products',
      version: '1.0.0',
      description: 'Documentación de micriservicio de Products',
    },
    servers: [
      {
        url: 'http://localhost:'+process.env.PORT,
      },
    ],
  },
  apis: ['./src/routes/productsRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:'+ process.env.PORT+'/api-docs');
};