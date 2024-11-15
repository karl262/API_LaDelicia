import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.1',
    info: {
        title: 'API de Pedidos - La Delicia',
        version: '1.0.0',
        description: 'Documentación de la API de pedidos para el sistema de gestión de la panadería La Delicia',
    },
    servers: [
    {
        url: 'http://localhost:3000/api/oreders',
        description: 'Servidor local',
    },
        ],
    },
    apis: ['./src/routes/orderRoutes.js'],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;