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
 *         - name
 *         - first_surname
 *         - last_surname
 *         - auth_user_id
 *         - city
 *         - date_of_birth
 *         - phone_number
 *         - postal_code
 *         - id_preferred_payment_method
 *       properties:
 *         first_surname:
 *           type: string
 *           description: El nombre del usuario
 *           example: Juan
 *         last_surname:
 *           type: string
 *           description: El apellido del usuario
 *           example: García
 *         auth_user_id:
 *           type: string
 *           description: El ID del usuario en el microservicio de autenticación
 *           example: 1
 *         city:
 *           type: string
 *           description: La ciudad de residencia del usuario
 *           example: Madrid
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: La fecha de nacimiento del usuario
 *           example: 1990-05-15
 *         phone_number:
 *           type: string
 *           description: El número de teléfono del usuario
 *           example: 5551234567
 *         postal_code:
 *           type: string
 *           description: El código postal de residencia del usuario
 *           example: 28001
 *         id_preferred_payment_method:
 *           type: string
 *           description: El ID del método de pago preferido del usuario
 *           example: 1
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: Error al realizar la petición
 * 
 *     UserMobile:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - first_surname
 *         - last_surname
 *         - phone_number
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: El nombre de usuario
 *           example: JuanGarcia
 *         name:
 *           type: string
 *           description: El nombre del usuario
 *           example: Juan
 *         first_surname:
 *           type: string
 *           description: El apellido del usuario
 *           example: García
 *         last_surname:
 *           type: string
 *           description: El apellido del usuario
 *           example: García
 *         phone_number:
 *           type: string
 *           description: El número de teléfono del usuario
 *           example: 5551234567
 *         email:
 *           type: string
 *           description: El correo electrónico del usuario
 *           example: 5o9t6@example.com
 *         password:
 *           type: string
 *           description: La contraseña del usuario
 *           example: password
 * 
 *     ErrorMobile:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: Error al realizar la petición
 * 
 *
 */

/**
 * @swagger
 * /api/users/getAll/users:
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
 * /api/users/get/users/{id}:
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
 * /api/users/get/users/by/user_name/{user_name}:
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
 * /api/users/create/user/mobile:
 *   post:
 *     summary: Crea un usuario móvil
 *     description: Registra un nuevo usuario móvil en el sistema.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserMobile'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Usuario móvil creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMobile'
 *       400:
 *         description: Datos inválidos enviados en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMobile'
 *       401:
 *         description: No se proporcionó un token de autenticación.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMobile'
 *
 */
/**
 * @swagger
 * /api/users/update/users/{id}:
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

router.post('/create/user', UserController.createUser);
router.post('/create/user/mobile', UserController.createUserMobile);
router.get('/getAll/users',authMiddleware, UserController.getAllUsers);
router.get('/get/users/:id',authMiddleware, UserController.getUserById);
router.get('/get/users//by/user_name/:user_name',authMiddleware, UserController.getUserByUserName);
router.put('/update/users/:id',authMiddleware, UserController.updateUser);
router.delete('/delete/user/:id',authMiddleware, UserController.deleteUser);

export default router;

