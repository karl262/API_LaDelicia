import express from 'express';
import setupSwagger from './src/config/swagger.js';
import orderRoutes from './src/routes/orderRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Swagger
setupSwagger(app);

// Rutas de la API
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log("Documentación disponible en http://localhost:3100/docs/orders/api-docs/api-docs");

});
