/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auths/get/auth/by/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
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
 *         description: Acceso denegado o token invalido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/auths/register/auth/user:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electronico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
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
 *         description: Faltan datos requeridos (nombre de usuario/correo electronico o contraseña)
 *       409:
 *         description: El usuario ya existe
 */
/**
 * @swagger
 * /api/auths/login/user:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contrase a del usuario
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
 *         description: Faltan datos requeridos (nombre de usuario/correo electronico o contraseña)
 *       401:
 *         description: Credenciales invalidas
 */

import express from "express";
import authController from "../controllers/authController.js";
import { validateDataLogin } from "../middlewares/authValidation.js";

const router = express.Router();

router.get(
  "/get/auth/by/:id",
  authController.getAuthByid,
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
router.patch(
  "/update/username/:id",
  authController.updateUsername
);


router.post("/initiate-password-reset", authController.initiatePasswordReset);
router.post("/reset-password", authController.resetPassword);

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

export default router;
