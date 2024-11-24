/**
 * @swagger
 *  components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - date_of_birth
 *         - phone_number
 *         - preferred_payment_method
 *         - auth_user_id
 *       properties:
 *         first_name:
 *           type: string
 *           description: El nombre del usuario
 *           example: Juan
 *         last_name:
 *           type: string
 *           description: El apellido del usuario
 *           example: García
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: La fecha de nacimiento del usuario
 *           example: 1990-05-15
 *         phone_number:
 *           type: string
 *           description: El número de teléfono del usuario
 *           example: 5551234567
 *         preferred_payment_method:
 *           type: string
 *           description: El método de pago preferido del usuario
 *           example: fisico
 *         auth_user_id:
 *           type: string
 *           description: El ID del usuario en el microservicio de autenticación
 *           example: auth123
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: Error al realizar la petición
 *
 */
/**
 * @swagger
 * /api/users/get/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Recupera una lista completa de usuarios almacenados en el sistema.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: No se encontraron usuarios.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 */
/**
 * @swagger
 * /api/users/get/users/by/id/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     description: Recupera la información de un usuario específico mediante su ID único.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario a obtener.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: No se encontró ningún usuario con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 */
/**
 * @swagger
 * /api/users/get/users/by/name/{user_name}:
 *   get:
 *     summary: Obtiene un usuario por su nombre
 *     description: Recupera la información de un usuario utilizando su nombre único.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del usuario a obtener.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: No se encontró ningún usuario con el nombre proporcionado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 */
/**
 * @swagger
 * /api/users/create/user:
 *   post:
 *     summary: Crea un usuario
 *     description: Registra un nuevo usuario en el sistema.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *
 */
/**
 * @swagger
 * /api/users/update/user/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     description: Modifica la información de un usuario existente utilizando su ID único.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos enviados en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 */
/**
 * @swagger
 * /api/users/delete/user/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     description: Elimina un usuario existente del sistema utilizando su ID único.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario a eliminar.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 */

import express from 'express';
import UserController from '../controllers/usersController.js';
import authMiddleware from '../middlewares/auth.js';

export const router = express.Router();

router.use(authMiddleware);

router.get('/get/users', UserController.getAllUsers);
router.get('/get/users/by/id/:id', UserController.getUserById);
router.get('/get/users/by/name/:user_name', UserController.getUserByUserName);
router.post('/create/user', UserController.createUser);
router.put('/update/user/:id', UserController.updateUser);
router.delete('/delete/user/:id', UserController.deleteUser);

export default router;

