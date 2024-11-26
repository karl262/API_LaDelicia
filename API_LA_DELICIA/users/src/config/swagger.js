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
      description: `
      Este microservicio gestiona los usuarios dentro de la plataforma **La Delicia**. Permite crear, consultar, actualizar y eliminar usuarios. También proporciona la capacidad de obtener usuarios mediante filtros como el nombre de usuario.

      ### Funcionalidades principales:
      - **Crear un nuevo usuario**
      - **Crear un usuario móvil**
      - **Obtener todos los usuarios**
      - **Obtener un usuario por ID**
      - **Obtener un usuario por nombre de usuario**
      - **Actualizar un usuario**
      - **Eliminar un usuario**
    `,
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