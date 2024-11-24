import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Microservicio_Pedidos - La Delicia',
      version: '1.0.0',
      description: 'Documentación de microservicio de Pedidos',
    },
    servers: [
      {
        url: 'http://localhost:3100',
      },
    ],
  },
  apis: ['./src/routes/orderRoutes.js'],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/docs/orders/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
