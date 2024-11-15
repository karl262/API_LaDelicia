import express from 'express';
import EmployeeController from '../controllers/employeeController.js';  
import authMiddleware from '../middlewares/auth.js';  

 const router = express.Router();

//router.use(authMiddleware);

router.get('/get/employees', EmployeeController.getAllEmployees);
router.get('/get/employees/by/id/:id', EmployeeController.getEmployeeById);
router.get('/get/employees/by/name/:name', EmployeeController.getEmployeeByName); 
router.post('/create/employee', EmployeeController.createEmployee);
router.put('/update/employee/:id', EmployeeController.updateEmployee);
router.delete('/delete/employees/:id', EmployeeController.deleteEmployee);

export default router;
