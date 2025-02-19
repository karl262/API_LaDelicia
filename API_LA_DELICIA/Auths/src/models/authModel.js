import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

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
}
