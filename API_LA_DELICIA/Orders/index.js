import express from 'express';
import setupSwagger from './src/config/swagger.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { startOrderExpirationScheduler } from './src/schedulers/orderScheduler.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(
  {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
  }
));

// Configurar Swagger
setupSwagger(app);

// Iniciar el scheduler para expirar pedidos
startOrderExpirationScheduler();

// Rutas de la API
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log("Documentación disponible en http://localhost:3100/docs/orders/api-docs");
});
