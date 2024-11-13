import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import orderRoutes from './src/routes/orderRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders',orderRoutes);

const port = process.env.PORT || 3000;
app.listen(port,'0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});