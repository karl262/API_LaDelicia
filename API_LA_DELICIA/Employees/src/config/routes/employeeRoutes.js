const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.get('/employees', EmployeeController.getAllEmployees);
router.get('/employees/:id', EmployeeController.getEmployeeById);
router.get('/employees/name/:name', EmployeeController.getEmployeeByName); 
router.get('/employees/salary/:salary', EmployeeController.getEmployeeBySalary);
router.post('/employees', EmployeeController.createEmployee);
router.put('/employees/:id', EmployeeController.updateEmployee);
router.delete('/employees/:id', EmployeeController.deleteEmployee);

module.exports = router;
