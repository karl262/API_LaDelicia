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
    id_preferred_payment_method,
    profile_image = process.env.DEFAULT_PROFILE_IMAGE,
  }) {
    try {
      const clientResult = await pool.query(
        "INSERT INTO client (city, date_of_birth, postal_code) VALUES ($1, $2, $3) RETURNING *",
        [city, date_of_birth, postal_code]
      );
      const client = clientResult.rows[0];
      const clientId = client.id;

      const userResult = await pool.query(
        "INSERT INTO users (name, first_surname, last_surname, auth_user_id, phone_number, profile_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, first_surname, last_surname, auth_user_id, phone_number, profile_image]
      );
      const user = userResult.rows[0];

      return { user, client };
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("Error al crear usuario en la base de datos");
    }
  }

  static async createUserMobile(userData) {
    const client = await pool.connect();
    
    try {
      // Destructure user data with default values
      const {
        username,
        name,
        first_surname,
        last_surname,
        phone_number,
        email,
        password,
        profile_image = process.env.DEFAULT_PROFILE_IMAGE
      } = userData;

      // Validate required fields
      const requiredFields = [
        { name: 'username', value: username },
        { name: 'name', value: name },
        { name: 'first_surname', value: first_surname },
        { name: 'last_surname', value: last_surname },
        { name: 'phone_number', value: phone_number },
        { name: 'email', value: email },
        { name: 'password', value: password }
      ];

      const missingFields = requiredFields
        .filter(field => !field.value)
        .map(field => field.name);

      if (missingFields.length > 0) {
        throw new Error(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
      }

      // Start transaction
      await client.query("BEGIN");

      // First, register in authentication service
      let authResponse;
      try {
        authResponse = await axios.post(
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
      } catch (authError) {
        console.error("Authentication Service Error:", {
          status: authError.response?.status,
          data: authError.response?.data,
          message: authError.message
        });

        await client.query("ROLLBACK");
        throw new Error(`Error en el servicio de autenticación: ${authError.response?.data?.errors?.join(', ') || authError.message}`);
      }

      // Extract the authentication user ID
      const authUserId = authResponse.data.user.id;

      // Then, create user with authentication ID
      const userResult = await client.query(
        `INSERT INTO users (name, first_surname, last_surname, phone_number, profile_image, auth_user_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [name, first_surname, last_surname, phone_number, profile_image, authUserId]
      );

      // Commit transaction
      await client.query("COMMIT");

      // Return the created user
      return userResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al crear usuario móvil:", {
        message: error.message,
        stack: error.stack
      });
      throw error;
    } finally {
      client.release();
    }
  }

  static async create(
    name,
    first_surname,
    last_surname,
    phone_number,
    profile_image = process.env.DEFAULT_PROFILE_IMAGE
  ) {
    const client = await pool.connect();
    
    try {
      // Start transaction
      await client.query("BEGIN");

      // Inserta el usuario en la base de datos
      const userResult = await client.query(
        `INSERT INTO users (name, first_surname, last_surname, phone_number, profile_image) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [name, first_surname, last_surname, phone_number, profile_image]
      );

      // Commit transaction
      await client.query("COMMIT");

      return userResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al crear usuario:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE delete_at IS NULL"
      );
      if (result.rows.length === 0) {
        return [];
      }

      const userData = result.rows;
      
      // Filter out users with null auth_user_id
      const usersWithAuthId = userData.filter(user => user.auth_user_id !== null);

      // If no users have auth_user_id, return just user data
      if (usersWithAuthId.length === 0) {
        return userData.map(user => ({
          user,
          auth: null
        }));
      }

      // Fetch auth data only for users with auth_user_id
      const authUserIds = usersWithAuthId.map((user) => user.auth_user_id);
      
      const responses = await Promise.all(
        authUserIds.map((authUserId) =>
          axios.get(
            `http://auth-service:3000/api/auths/get/auth/by/${authUserId}`
          ).catch(error => {
            console.error(`Error fetching auth for user ${authUserId}:`, error.message);
            return { data: null }; // Return null for failed requests
          })
        )
      );

      const authData = responses.map(response => response.data);

      // Combine user data with auth data, handling null cases
      const combinedData = userData.map((user, index) => {
        const authIndex = usersWithAuthId.findIndex(u => u.id === user.id);
        return {
          user,
          auth: authIndex !== -1 ? authData[authIndex] : null
        };
      });

      return combinedData;
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw new Error("Error al buscar usuarios en la base de datos");
    }
  }

  static async findById(id) {
    try {
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      
      if (user.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const userData = user.rows[0];

      // If auth_user_id is null or not found in auth service, return user data without auth
      if (!userData.auth_user_id) {
        console.warn(`Usuario ${id} no tiene ID de autenticación`);
        return {
          ...userData,
          auth: null
        };
      }

      try {
        const authResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auths/get/auth/by/${userData.auth_user_id}`);
        return {
          ...userData,
          auth: authResponse.data
        };
      } catch (authError) {
        console.error(`Error al obtener datos de autenticación para usuario ${id}:`, authError.message);
        return {
          ...userData,
          auth: null
        };
      }
    } catch (error) {
      console.error(`Error al buscar usuario ${id}:`, error);
      throw new Error('Error al buscar usuarios en la base de datos');
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
    preferred_payment_method,
    profile_image
  ) {
    const result = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, phone_number = $4, preferred_payment_method = $5, profile_image = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND delete_at IS NULL RETURNING *",
      [
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        preferred_payment_method,
        profile_image || null,
        id,
      ]
    );
    return result.rows[0];
  }

  static async updateProfileImage(id, profile_image) {
    const result = await pool.query(
      "UPDATE users SET profile_image = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND delete_at IS NULL RETURNING *",
      [profile_image, id]
    );
    
    if (result.rowCount === 0) {
      throw new Error(`No se encontró el usuario con id ${id}`);
    }
    
    return result.rows[0];
  }

  static async updateUser(id, updateData) {
    // Validate input
    if (!id || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
      throw new Error('ID de usuario y datos de actualización son requeridos');
    }

    // Allowed fields for update
    const allowedFields = [
      'name', 
      'first_surname', 
      'last_surname', 
      'phone_number', 
      'profile_image'
    ];

    // Filter out any fields not allowed
    const validUpdateFields = Object.keys(updateData)
      .filter(field => allowedFields.includes(field));

    // Check if there are any valid fields to update
    if (validUpdateFields.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    // Construct dynamic update query
    const updateSetClauses = validUpdateFields.map((field, index) => 
      `${field} = $${index + 1}`
    ).join(', ');

    const queryValues = validUpdateFields.map(field => updateData[field]);
    queryValues.push(id);

    try {
      const result = await pool.query(
        `UPDATE users 
         SET ${updateSetClauses}, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $${queryValues.length} 
         AND delete_at IS NULL 
         RETURNING *`,
        queryValues
      );

      // Check if user was found and updated
      if (result.rowCount === 0) {
        throw new Error(`Usuario con ID ${id} no encontrado o ya eliminado`);
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  static async delete(id) {
    const result = await pool.query(
      "UPDATE users SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}
