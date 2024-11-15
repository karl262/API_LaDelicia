import express from 'express';
import productsRoutes from './src/routes/productsRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/products',productsRoutes);

const port = process.env.PORT || 3000;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

export default app;