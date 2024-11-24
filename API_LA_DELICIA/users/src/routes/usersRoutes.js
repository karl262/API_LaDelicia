/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Obtiene todos los usuarios
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Usuarios obtenidos con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuarios no encontrados
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     description: Obtiene un usuario por su ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /users/name/{user_name}:
 *   get:
 *     summary: Obtiene un usuario por su nombre
 *     description: Obtiene un usuario por su nombre
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un usuario
 *     description: Crea un usuario
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validaci n
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     description: Actualiza un usuario por su ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validaci n
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     description: Elimina un usuario por su ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado con exito
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */

import express from 'express';
import UserController from '../controllers/usersController.js';
import authMiddleware from '../middlewares/auth.js';

export const router = express.Router();

router.use(authMiddleware);

router.post('/create/user', UserController.createUser);
router.get('/getAll/users', UserController.getAllUsers);
router.get('/get/users/:id', UserController.getUserById);
router.get('/get/users//by/user_name/:user_name', UserController.getUserByUserName);
router.put('/update/users/:id', UserController.updateUser);
router.delete('/delete/user/:id', UserController.deleteUser);
router.post('/create/user/mobile', UserController.createUserMobile);

export default router;
