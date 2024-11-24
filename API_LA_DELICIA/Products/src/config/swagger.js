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
        url: 'http://localhost:3100',
      },
    ],
  },
  apis: ['./src/routes/productsRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default function swaggerDocs(app) {
  app.use('/docs/products/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:3100/docs/products/api-docs');
};
