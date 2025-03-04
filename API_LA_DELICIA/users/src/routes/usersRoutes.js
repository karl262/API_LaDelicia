import express from "express";
import UserController from "../controllers/usersController.js";
import { authMiddleware, checkRole } from "../middlewares/auth.js";
import upload from "../config/multer.js"; 

/**
 * @swagger
 * /api/users/create/user:
 *   post:
 *     summary: Crea un usuario
 *     description: Registra un nuevo usuario en el sistema con una imagen de perfil predeterminada.
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
 *         description: Usuario creado exitosamente con imagen de perfil predeterminada.
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
 *     description: Registra un nuevo usuario móvil en el sistema con una imagen de perfil predeterminada.
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
 *         description: Usuario móvil creado exitosamente con imagen de perfil predeterminada.
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

export const router = express.Router();

router.post("/create/user", UserController.createUser);
router.post("/create/user/mobile", UserController.createUserMobile);
router.get("/get/users/by/:id", authMiddleware, checkRole(['user', 'admin']), UserController.getUserById);
router.get("/get/users/by/user_name/:user_name", authMiddleware, checkRole(['user', 'admin']), UserController.getUserByUserName);
router.get("/getAll/users", authMiddleware, checkRole(['admin']), UserController.getAllUsers);
router.put("/update/users/:id", authMiddleware, checkRole(['user', 'admin']), UserController.updateUser);
router.put('/users/profile-image/:id', upload.single('profile_image'), authMiddleware, checkRole(['user', 'admin']), UserController.updateUserProfileImage);
router.delete("/delete/user/:id", authMiddleware, checkRole(['admin']), UserController.deleteUser);

export default router;