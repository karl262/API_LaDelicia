import {express} from 'express';
import {EmployeeController} from '../controllers/employeeController';
import {AuthMiddleware} from '../middlewares/auth';

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.get('/employees', EmployeeController.getAllEmployees);
router.get('/employees/:id', EmployeeController.getEmployeeById);
router.get('/employees/name/:name', EmployeeController.getEmployeeByName); 
router.post('/employees', EmployeeController.createEmployee);
router.put('/employees/:id', EmployeeController.updateEmployee);
router.delete('/employees/:id', EmployeeController.deleteEmployee);

export default router;
