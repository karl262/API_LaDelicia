const express = require('express'); 
const cors = require('cors');
const dotenv = require('dotenv');
const ordersRoutes = require('./src/routes/orderRoutes'); // Ajusta esta ruta si es necesario

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Usa la ruta '/api/orders' para todas las rutas de pedidos
app.use('/api', ordersRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
