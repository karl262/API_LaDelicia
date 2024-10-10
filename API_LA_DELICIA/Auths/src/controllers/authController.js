const authModel = require('../models/authModel');
const { generateAccessToken } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const { validateJwtToken } = require('../middlewares/authMiddleware');

class authController{

  static async login(req, res) {
      try {
          const { email, username, password } = req.body;
          if (!email || !username || !password) {
              return res.status(400).json({ error: 'Se requiere el correo electrónico, el nombre de usuario y la contraseña' });
          }

          const loginData = { email, username, password };

          const user = await authModel.getDataLogin(loginData);
          console.log(user);
          if (!user) {
              return res.status(401).json({ error: 'Credenciales inválidas' });
          }

          const accessToken = generateAccessToken(user);
          res.status(200).header('Authorization', accessToken).json({
              message: 'Usuario autenticado',
              token: accessToken
          });
      } catch (error) {
          console.error("Error durante el inicio de sesión:", error);
          if (error.message === 'JWT_SECRET no está definido en las variables de entorno') {
              return res.status(500).json({ error: 'Error de configuración del servidor' });
          }
          res.status(500).json({ error: 'Error durante el inicio de sesión', detalles: error.message });
      }
  }

  static async verifyToken(req, res) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
          return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
      }

      const result = validateJwtToken(authHeader, res);
      
      // Verifica si el resultado es un objeto de error
      if (result.status !== 200) {
          return res.status(result.status).json({ 
              mensaje: result.message,
              usuario: null
          });
      }

      return res.status(result.status).json({ 
          mensaje: result.message,
          usuario: result.user
      });
  }
}

module.exports = authController;