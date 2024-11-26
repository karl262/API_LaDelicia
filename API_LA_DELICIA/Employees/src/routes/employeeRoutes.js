import express from 'express';
import EmployeeController from '../controllers/employeeController.js';
import authMiddleware from '../middlewares/auth.js';

export const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/get/employees:
 *   get:
 *     summary: Obtiene todos los empleados activos.
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Lista de empleados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
/**
 * @swagger
 * /api/get/employees/by/id/{id}:
 *   get:
 *     summary: Obtiene un empleado por su ID.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del empleado.
 *     responses:
 *       200:
 *         description: Datos del empleado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /api/get/employees/by/name/{name}:
 *   get:
 *     summary: Obtiene empleados por nombre.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del empleado.
 *     responses:
 *       200:
 *         description: Lista de empleados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/create/employee:
 *   post:
 *     summary: Crea un nuevo empleado.
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_employee:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               street_address:
 *                 type: string
 *               city_address:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               cellphone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empleado creado.
 */

/**
 * @swagger
 * /api/update/employee/{id}:
 *   put:
 *     summary: Actualiza un empleado por su ID.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del empleado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_employee:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               street_address:
 *                 type: string
 *               city_address:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               cellphone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Empleado actualizado.
 */

/**
 * @swagger
 * /api/delete/employees/{id}:
 *   delete:
 *     summary: Elimina un empleado por su ID.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del empleado.
 *     responses:
 *       200:
 *         description: Empleado eliminado.
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica la salud del servicio.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servicio activo.
 */

router.get('/get/employees', EmployeeController.getAllEmployees);
router.get('/get/employees/by/id/:id', EmployeeController.getEmployeeById);
router.get('/get/employees/by/name/:name', EmployeeController.getEmployeeByName);
router.post('/create/employee', EmployeeController.createEmployee);
router.put('/update/employee/:id', EmployeeController.updateEmployee);
router.delete('/delete/employees/:id', EmployeeController.deleteEmployee);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'employee-service' });
});

export default router;
