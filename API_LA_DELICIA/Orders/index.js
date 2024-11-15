import express from 'express';
import setupSwagger from '../Orders/src/config/swagger.js';
import orderRoutes from './src/routes/orderRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Configurar Swagger
setupSwagger(app);

// Rutas de la API
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
