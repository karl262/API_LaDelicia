
import express from 'express';
import saleRoutes from './src/routes/saleRoutes.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

// Configuración de Swagger
swaggerSetup(app);

// Rutas de ventas
app.use('/api/sales', saleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Sales Service running on port ${PORT}`);
});
