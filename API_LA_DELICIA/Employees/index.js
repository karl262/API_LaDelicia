import express from 'express';
import employeesRoutes from './src/routes/employeeRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();
app.use(express.json());

app.use(cors());

app.use('/api/employees', employeesRoutes);

const port = process.env.PORT || 3000;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
}); 

export default app;