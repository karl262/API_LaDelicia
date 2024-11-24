import { pool } from "../config/db.js";
import axios from "axios";

export default class User {
  static async create({
    name,
    first_surname,
    last_surname,
    auth_user_id,
    city,
    date_of_birth,
    phone_number,
    postal_code,
    id_preferred_payment_method
  }) {
    try {
      const clientResult = await pool.query(
        "INSERT INTO client (city, date_of_birth, postal_code) VALUES ($1, $2, $3) RETURNING *",
        [city, date_of_birth, postal_code]
      );
      const client = clientResult.rows[0];
      const clientId = client.id;

      const userResult = await pool.query(
        "INSERT INTO users (name, first_surname, last_surname, auth_user_id, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, first_surname, last_surname, auth_user_id, phone_number]
      );
      const user = userResult.rows[0];

      return { user, client };
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("Error al crear usuario en la base de datos");
    }
  }

  
  static async createUserMobile({
    username,
    name,
    first_surname,
    last_surname,
    phone_number,
    email,
    password,
  }) {
    const client = await pool.connect(); 
    try {
      await client.query("BEGIN");
  
      // Inserta el usuario en la base de datos
      const userResult = await client.query(
        `INSERT INTO users (name, first_surname, last_surname, phone_number) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, first_surname, last_surname, phone_number`,
        [name, first_surname, last_surname, phone_number]
      );
  
      const user = userResult.rows[0];
  
      await client.query(
        `UPDATE users 
         SET auth_user_id = $1 
         WHERE id = $1`,
        [user.id]
      );
  
      await axios.post(
        "http://auth-service:3000/api/auths/register/auth/user",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      await client.query("COMMIT");
      return user; 
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al crear usuario:", error);
      throw new Error("Error al crear usuario en la base de datos");
    } finally {
      client.release(); 
    }
  }

  static async findAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE delete_at IS NULL "
      );
      if (result.rows.length === 0) {
        return [];
      }

      const userData = result.rows;
      const authUserIds = userData.map((user) => user.auth_user_id);
      const responses = await Promise.all(
        authUserIds.map((authUserId) =>
          axios.get(
            `http://auth-service:3000/api/auths/get/auth/by/${authUserId}`
          )
        )
      );
      const authData = responses.map((response) => response.data);
      const combinedData = userData.map((user, index) => ({
        user,
        auth: authData[index],
      }));
      return combinedData;
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw new Error("Error al buscar usuarios en la base de datos");
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE id = $1 AND delete_at IS NULL",
        [id]
      );
      const userData = result.rows[0];
      const authUserId = userData.auth_user_id;
      const response = await axios.get(
        `http://auth-service:3000/api/auth/by/${authUserId}`
      );
      const authData = response.data;
      return { user: userData, auth: authData };
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw new Error("Error al buscar usuarios en la base de datos");
    }
  }

  static async findByUserName(name) {
    const result = await pool.query(
      "SELECT * FROM users WHERE first_name ILIKE $1 AND delete_at IS NULL",
      [`%${name}%`]
    );
    return result.rows;
  }

  static async update(
    id,
    first_name,
    last_name,
    date_of_birth,
    phone_number,
    preferred_payment_method
  ) {
    const result = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, phone_number = $4, preferred_payment_method = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND delete_at IS NULL RETURNING *", // Corregido update_at a updated_at
      [
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        preferred_payment_method,
        id,
      ]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "UPDATE users SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}
