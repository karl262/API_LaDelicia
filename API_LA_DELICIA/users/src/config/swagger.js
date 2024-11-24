import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio_Users',
      version: '1.0.0',
      description: 'Documentación de micriservicio de Users',
    },
    servers: [
      {
        url: 'http://localhost:3100',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default function swaggerDocs(app) {
  app.use('/docs/users/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:3100/docs/users/api-docs');
};