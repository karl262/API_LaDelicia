import express from 'express';
import productsRoutes from './src/routes/productsRoutes.js';
import dotenv from 'dotenv';
import swaggerDocs from './src/config/swagger.js';

dotenv.config();

const app = express();
app.use(express.json());
swaggerDocs(app);

app.use('/api/products',productsRoutes);

const port = process.env.PORT || 3000;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

export default app;