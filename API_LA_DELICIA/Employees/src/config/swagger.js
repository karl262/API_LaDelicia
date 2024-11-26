import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Microservicio de Employee',
    version: '1.0.0',
    description: 'Microservicio para la gestión de empleados.',
  },
  servers: [
    {
      url: 'http://localhost:3000', 
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
