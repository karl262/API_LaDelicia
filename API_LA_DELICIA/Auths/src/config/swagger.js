import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio_Auths - La Delicia',
      version: '1.0.0',     
      description: `
      Este microservicio maneja la autenticación y autorización de usuarios dentro de la plataforma **La Delicia**. 
      Proporciona endpoints seguros para registrar usuarios, iniciar sesión y verificar tokens de autenticación.

      ### Funcionalidades principales:
      - **Obtener autenticación por ID**
      - **Registro de usuarios**
      - **Inicio de sesión**
      - **Verificación de token**
    `,
    },
    servers: [
      {
        url: 'https://stirred-sculpin-carefully.ngrok-free.app', 
      },
    ],
  },
  apis: ['./src/routes/authRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/docs/auths/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at https://stirred-sculpin-carefully.ngrok-free.app/docs/auths/api-docs/');
};

export default swaggerDocs;