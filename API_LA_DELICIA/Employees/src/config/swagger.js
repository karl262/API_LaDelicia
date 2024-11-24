import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'Microservicio_Empleados - La Delicia',
        version: '1.0.0',
        description: 'Documentación de microservicio de Empleados',
      },
      servers: [
        {
          url: 'http://localhost:3100',
        },
      ],
    },
    apis: ['./src/routes/*.js'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  const setupSwagger = (app) => {
    app.use('/docs/employees/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  };
  
  export default setupSwagger;
  