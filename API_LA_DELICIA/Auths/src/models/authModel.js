import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import EmailService from "../utils/emailService.js";

export default class authModel {
  static async getaAuthByid(id) {
    const result = await pool.query("SELECT * FROM auth_user WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async getDataLogin({ username, email, password }) {
    try {
      console.log("Intentando login con:", { username, email });
      let query;
      let params;

      if (username) {
        query = "SELECT * FROM auth_user WHERE username = $1";
        params = [username];
      } else if (email) {
        query = "SELECT * FROM auth_user WHERE email = $1";
        params = [email];
      } else {
        throw new Error(
          "Se requiere el nombre de usuario o correo electrónico"
        );
      }

      const result = await pool.query(query, params);
      console.log("Resultado de la consulta:", result.rows);

      const user = result.rows[0];

      if (user) {
        let isMatch;
        if (
          user.password.startsWith("$2a$") ||
          user.password.startsWith("$2b$")
        ) {
          isMatch = await bcrypt.compare(password, user.password);
        } else {
          isMatch = password === user.password;
        }
        console.log("¿Contraseña coincide?", isMatch);
        if (isMatch) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
      }
      console.log("Usuario no encontrado o contraseña incorrecta");
      return null;
    } catch (error) {
      console.error("Error en la autenticación:", error);
      throw new Error("Error en la autenticación");
    }
  }

  static async register(email, username, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO auth_user (email, username, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, username, hashedPassword, role]
    );
    const { password: _, ...userWithoutPassword } = result.rows[0];
    return userWithoutPassword;
  }

  static async registerAdmin(email, username, password) {
    return this.register(email, username, password, 'admin');
  }

  static async updateUsername(id, newUsername) {
    try {
      // Check if the new username already exists
      const existingUser = await pool.query(
        "SELECT * FROM auth_user WHERE username = $1", 
        [newUsername]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Update the username
      const result = await pool.query(
        "UPDATE auth_user SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", 
        [newUsername, id]
      );

      // Check if user was found and updated
      if (result.rowCount === 0) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }

      // Remove sensitive information before returning
      const { password, ...userWithoutPassword } = result.rows[0];
      return userWithoutPassword;
    } catch (error) {
      console.error('Error al actualizar nombre de usuario:', error);
      throw error;
    }
  }

  static async initiatePasswordReset(email) {
    try {
      // Find user by email
      const result = await pool.query(
        'SELECT id, email FROM auth_user WHERE email = $1', 
        [email]
      );
  
      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }
  
      const user = result.rows[0];
  
      // Send verification code via email
      const verificationDetails = await EmailService.sendVerificationCode(email);
  
      // Store verification details in database
      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, verification_code, expires_at) VALUES ($1, $2, $3)',
        [user.id, verificationDetails.code, verificationDetails.expiresAt]
      );
  
      return { userId: user.id, message: 'Código de verificación enviado' };
    } catch (error) {
      console.error('Error iniciando recuperación de contraseña:', error);
      throw error;
    }
  }
  
  static async resetPassword(userId, verificationCode, newPassword) {
    try {
      // Verify verification code
      const tokenResult = await pool.query(
        'SELECT * FROM password_reset_tokens WHERE user_id = $1 AND verification_code = $2 AND expires_at > NOW()',
        [userId, verificationCode]
      );
  
      if (tokenResult.rows.length === 0) {
        throw new Error('Código de verificación inválido o expirado');
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password
      await pool.query(
        'UPDATE auth_user SET password = $1 WHERE id = $2',
        [hashedPassword, userId]
      );
  
      // Delete used token
      await pool.query(
        'DELETE FROM password_reset_tokens WHERE user_id = $1',
        [userId]
      );
  
      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      console.error('Error restableciendo contraseña:', error);
      throw error;
    }
  }
}
