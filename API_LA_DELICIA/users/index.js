import express from 'express';
import cors from 'cors';
import usersRoutes from './src/routes/usersRoutes.js';
import dotenv from 'dotenv';
import swaggerDocs from './src/config/swagger.js';

dotenv.config();

const app = express();
swaggerDocs(app);

app.use(cors());
app.use(express.json());

app.use('/api/users',usersRoutes);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
