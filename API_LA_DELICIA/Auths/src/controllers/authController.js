import authModel from "../models/authModel.js";
import { generateAccessToken } from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import { validateJwtToken } from "../middlewares/authMiddleware.js";


export default class authController {
  static async getAuthByid(req, res) {
    const { id } = req.params;
    try {
      const user = await authModel.getaAuthByid(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }

  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username && !email && !password) {
        return res
          .status(400)
          .json({
            error:
              "Se requieren todos los datos nombre se usuario, email, contraseña",
          });
      }

      const user = await authModel.register(email, username, password);
      res
        .status(201)
        .json({ message: "Usuario registrado exitosamente", user });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  }

  static async login(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!password) {
        return res.status(400).json({ error: "Se requiere la contraseña" });
      }

      let loginData;

      if (username && password) {
        loginData = { username, password };
      } else if (email && password) {
        loginData = { email, password };
      } else {
        return res
          .status(400)
          .json({
            error:
              "Se requiere el nombre de usuario o correo electrónico y la contraseña",
          });
      }

      const user = await authModel.getDataLogin(loginData);
      console.log(user);
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const accessToken = generateAccessToken(user);
      res.status(200).header("Authorization", accessToken).json({
        user: user.id,
        message: "Usuario autenticado",
        token: accessToken,
      });
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      if (
        error.message ===
        "JWT_SECRET no está definido en las variables de entorno"
      ) {
        return res
          .status(500)
          .json({ error: "Error de configuración del servidor" });
      }
      res
        .status(500)
        .json({
          error: "Error durante el inicio de sesión",
          detalles: error.message,
        });
    }
  }

  static async verifyToken(req, res) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ mensaje: "Acceso denegado. No se proporcionó token." });
    }

    const result = validateJwtToken(authHeader, res);

    if (result.status !== 200) {
      return res.status(result.status).json({
        mensaje: result.message,
        usuario: null,
      });
    }

    return res.status(result.status).json({
      mensaje: result.message,
      usuario: result.user,
    });
  }

  static async updateUsername(req, res) {
    try {
      const { id } = req.params;
      const { username } = req.body;

      // Validate input
      if (!username) {
        return res.status(400).json({ 
          error: "El nombre de usuario es requerido" 
        });
      }

      // Update username
      const updatedUser = await authModel.updateUsername(id, username);
      
      res.json({
        message: "Nombre de usuario actualizado exitosamente",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error al actualizar nombre de usuario:", error);
      
      // Handle specific error types
      if (error.message.includes('nombre de usuario ya está en uso')) {
        return res.status(409).json({ 
          error: "Conflicto de nombre de usuario", 
          details: error.message 
        });
      }

      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ 
          error: "Usuario no encontrado", 
          details: error.message 
        });
      }
      
      // Generic server error
      res.status(500).json({ 
        error: "Error interno del servidor", 
        details: error.message 
      });
    }
  }

  static async initiatePasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          error: "Correo electrónico es requerido" 
        });
      }

      const result = await authModel.initiatePasswordReset(email);
      
      res.status(200).json({
        message: result.message,
        userId: result.userId
      });
    } catch (error) {
      console.error("Error iniciando recuperación de contraseña:", error);
      
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }
      
      res.status(500).json({ 
        error: "Error interno del servidor", 
        details: error.message 
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { userId, verificationCode, newPassword } = req.body;

      // Validate input
      if (!userId || !verificationCode || !newPassword) {
        return res.status(400).json({ 
          error: "Todos los campos son requeridos" 
        });
      }

      const result = await authModel.resetPassword(
        userId, 
        verificationCode, 
        newPassword
      );
      
      res.status(200).json({
        message: result.message
      });
    } catch (error) {
      console.error("Error restableciendo contraseña:", error);
      
      if (error.message.includes('Código de verificación inválido o expirado')) {
        return res.status(400).json({ 
          error: "Código de verificación inválido o expirado" 
        });
      }
      
      res.status(500).json({ 
        error: "Error interno del servidor", 
        details: error.message 
      });
    }
  }

}
