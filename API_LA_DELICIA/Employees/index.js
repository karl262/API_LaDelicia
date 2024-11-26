import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import employeeRoutes from './src/routes/employeeRoutes.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de empleados
app.use('/', employeeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
