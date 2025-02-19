import express from 'express';
import employeesRoutes from './src/routes/employeeRoutes.js'; // Nombre consistente
import setupSwagger from './src/config/swagger.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3000;

// Configurar middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

setupSwagger(app);

// Rutas de la API
app.use('/api/employees', employeesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
    console.log("Documentación disponible en http://localhost:3100/docs/employees/api-docs");
});
