import {express} from 'express';
import {productsRoutes} from './src/routes/productsRoutes';
import{dotenv} from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', productsRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});