/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       400:
 *         description: Faltan datos requeridos (nombre de usuario/correo electrónico o contraseña)
 *       409:
 *         description: El usuario ya existe
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Faltan datos requeridos (nombre de usuario/correo electrónico o contraseña)
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /api/auth/verify-token:
 *   post:
 *     summary: Verificar token de autenticación
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Acceso denegado o token inválido
 */

import express from 'express';
import authController from '../controllers/authController.js';
import { validateDataLogin } from '../middlewares/authValidation.js';

const router = express.Router();

router.get(
  "/get/auth/by/:id",
  authController.getaAuthByid,
  authController.verifyToken
);
router.post(
  "/register/auth/user",
  validateDataLogin,
  authController.register,
  authController.verifyToken
);
router.post("/login/user", validateDataLogin, authController.login);
router.post("/verify-token", authController.verifyToken);

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

export default router;
