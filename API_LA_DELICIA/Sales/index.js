const express = require('express');
const saleRoutes = require('./src/routes/saleRoutes.js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Rutas de ventas
app.use('/api/sales', saleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Sales Service running on port ${PORT}`);
});
