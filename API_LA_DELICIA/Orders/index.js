import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import orderRoutes from './src/routes/orderRoutes.js';
import setupSwagger from './src/config/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app); // Integrar Swagger

app.use('/api/oreders', orderRoutes);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
});
