import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

swaggerDocs(app);
app.use(bodyParser.json());
app.use('/api/auths', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Auth Service is running on port ${PORT}`);
});

export default app;