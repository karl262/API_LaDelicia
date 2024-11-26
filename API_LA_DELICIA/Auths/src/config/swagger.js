import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio_Auths - La Delicia', // Título de la documentación
      version: '1.0.0',       // Versión de la API
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
        url: 'http://localhost:3100', // URL base del servidor de la API
      },
    ],
  },
  apis: ['./src/routes/authRoutes.js'], // Rutas donde están tus archivos de rutas para generar la documentación automáticamente
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/docs/auths/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:3100/docs/auths/api-docs');
};

export default swaggerDocs;