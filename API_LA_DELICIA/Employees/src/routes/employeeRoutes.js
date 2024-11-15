const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.get('/get/employees', EmployeeController.getAllEmployees);
router.get('/get/employees/by/id/:id', EmployeeController.getEmployeeById);
router.get('/get/employees/by/name/:name', EmployeeController.getEmployeeByName); 
router.post('/create/employee', EmployeeController.createEmployee);
router.put('/update/employee/:id', EmployeeController.updateEmployee);
router.delete('/delete/employees/:id', EmployeeController.deleteEmployee);


router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'employee-service' });
});

module.exports = router;
