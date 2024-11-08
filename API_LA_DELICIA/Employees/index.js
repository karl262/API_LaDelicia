import {express} from 'express';
import {employeesRoutes} from './src/routes/employeeRoutes';
import {dotenv} from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', employeesRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 