/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - name_employee
 *         - last_name
 *         - street_address
 *         - city_address
 *         - postal_code
 *         - cellphone_number
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del empleado
 *           example: 1
 *         name_employee:
 *           type: string
 *           description: Nombre del empleado
 *           example: Juan
 *         middle_name:
 *           type: string
 *           description: Segundo nombre del empleado
 *           example: Carlos
 *         last_name:
 *           type: string
 *           description: Apellido del empleado
 *           example: García
 *         street_address:
 *           type: string
 *           description: Dirección del empleado
 *           example: Calle Falsa 123
 *         city_address:
 *           type: string
 *           description: Ciudad del empleado
 *           example: Ciudad de México
 *         postal_code:
 *           type: string
 *           description: Código postal del empleado
 *           example: 12345
 *         cellphone_number:
 *           type: string
 *           description: Número de teléfono del empleado
 *           example: 5551234567
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: Error al procesar la solicitud
 */

/**
 * @swagger
 * /api/employees/get/employees:
 *   get:
 *     summary: Obtiene todos los empleados activos.
 *     description: Recupera una lista completa de empleados almacenados en el sistema.
 *     tags:
 *       - Employees
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/employees/get/employees/by/id/{id}:
 *   get:
 *     summary: Obtiene un empleado por su ID.
 *     description: Recupera la información de un empleado específico mediante su ID único.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID único del empleado.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Información del empleado obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: No se encontró ningún empleado con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/employees/get/employees/by/name/{name}:
 *   get:
 *     summary: Obtiene un empleado por su nombre.
 *     description: Recupera la información de un empleado específico mediante su nombre.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del empleado.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Información del empleado obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: No se encontró ningún empleado con el nombre proporcionado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/employees/create/employee:
 *   post:
 *     summary: Crea un nuevo empleado.
 *     description: Registra un nuevo empleado en el sistema.
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Datos inválidos enviados en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/employees/update/employee/{id}:
 *   put:
 *     summary: Actualiza un empleado por su ID.
 *     description: Modifica la información de un empleado existente utilizando su ID único.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID único del empleado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Empleado actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Datos inválidos enviados en la solicitud.
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: Empleado no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/employees/delete/employees/{id}:
 *   delete:
 *     summary: Elimina un empleado por su ID.
 *     description: Elimina un empleado existente del sistema utilizando su ID único.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID único del empleado.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Empleado eliminado exitosamente.
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: Empleado no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import express from "express";
import EmployeeController from "../controllers/employeeController.js";
import authMiddleware from "../middlewares/auth.js";

export const router = express.Router();

router.use(authMiddleware);
router.get("/get/employees", EmployeeController.getAllEmployees);
router.get("/get/employees/by/id/:id", EmployeeController.getEmployeeById);
router.get(
  "/get/employees/by/name/:name",
  EmployeeController.getEmployeeByName
);
router.post("/create/employee", EmployeeController.createEmployee);
router.put("/update/employee/:id", EmployeeController.updateEmployee);
router.delete("/delete/employees/:id", EmployeeController.deleteEmployee);

export default router;
