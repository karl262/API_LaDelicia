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
            profile_image = process.env.DEFAULT_PROFILE_IMAGE,
            city = null, // Default value for city
            date_of_birth = null, // Default value for date_of_birth
            postal_code = null, // Default value for postal_code
            id_preferred_payment_method = 1 // Default value for preferred payment method
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
            console.log("Datos enviados al servicio de autenticación:", {
                username,
                email,
                password
            });

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
                data: authError.response?.data, // Detalles del error
                message: authError.message
            });

            await client.query("ROLLBACK");
            throw new Error(`Error en el servicio de autenticación: ${JSON.stringify(authError.response?.data) || authError.message}`);
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

        const userId = userResult.rows[0].id;

        // Create client associated with the user (city, date_of_birth, and postal_code are optional)
        const clientResult = await client.query(
            `INSERT INTO client (city, date_of_birth, postal_code, id_preferred_payment_method, user_id) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [city, date_of_birth, postal_code, id_preferred_payment_method, userId]
        );

        // Commit transaction
        await client.query("COMMIT");

        // Return the created user and client
        return {
            user: userResult.rows[0],
            client: clientResult.rows[0]
        };
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
      // Obtener todos los usuarios que no han sido eliminados
      const usersResult = await pool.query(
        "SELECT * FROM users WHERE delete_at IS NULL"
      );
  
      if (usersResult.rows.length === 0) {
        return [];
      }
  
      const userData = usersResult.rows;
  
      // Filtrar usuarios con auth_user_id no nulo
      const usersWithAuthId = userData.filter(user => user.auth_user_id !== null);
  
      // Si no hay usuarios con auth_user_id, devolver solo los datos de usuario y cliente
      if (usersWithAuthId.length === 0) {
        const usersWithClients = await Promise.all(
          userData.map(async (user) => {
            const clientResult = await pool.query(
              "SELECT * FROM client WHERE user_id = $1 AND delete_at IS NULL",
              [user.id]
            );
            return {
              user,
              auth: null,
              client: clientResult.rows[0] || null // Cliente asociado (si existe)
            };
          })
        );
        return usersWithClients;
      }
  
      // Obtener datos de autenticación para usuarios con auth_user_id
      const authUserIds = usersWithAuthId.map((user) => user.auth_user_id);
  
      const authResponses = await Promise.all(
        authUserIds.map((authUserId) =>
          axios.get(
            `http://auth-service:3000/api/auths/get/auth/by/${authUserId}`
          ).catch(error => {
            console.error(`Error fetching auth for user ${authUserId}:`, error.message);
            return { data: null }; // Devolver null para solicitudes fallidas
          })
        )
      );
  
      const authData = authResponses.map(response => response.data);
  
      // Combinar datos de usuario, autenticación y cliente
      const combinedData = await Promise.all(
        userData.map(async (user, index) => {
          const authIndex = usersWithAuthId.findIndex(u => u.id === user.id);
          const clientResult = await pool.query(
            "SELECT * FROM client WHERE user_id = $1 AND delete_at IS NULL",
            [user.id]
          );
          return {
            user,
            auth: authIndex !== -1 ? authData[authIndex] : null,
            client: clientResult.rows[0] || null // Cliente asociado (si existe)
          };
        })
      );
  
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
    const client = await pool.connect();
    
    try {
        // Validar entrada
        if (!id || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
            throw new Error('ID de usuario y datos de actualización son requeridos');
        }

        // Campos permitidos para actualización
        const allowedFields = [
            'name', 
            'first_surname', 
            'last_surname', 
            'phone_number', 
            'profile_image',
            'city', // Campo opcional para el cliente
            'date_of_birth', // Campo opcional para el cliente
            'postal_code', // Campo opcional para el cliente
            'id_preferred_payment_method' // Campo opcional para el cliente
        ];

        // Filtrar campos no permitidos
        const validUpdateFields = Object.keys(updateData)
            .filter(field => allowedFields.includes(field));

        // Verificar si hay campos válidos para actualizar
        if (validUpdateFields.length === 0) {
            throw new Error('No se proporcionaron campos válidos para actualizar');
        }

        // Separar campos de usuario y cliente
        const userFields = validUpdateFields.filter(field => 
            !['city', 'date_of_birth', 'postal_code', 'id_preferred_payment_method'].includes(field)
        );
        const clientFields = validUpdateFields.filter(field => 
            ['city', 'date_of_birth', 'postal_code', 'id_preferred_payment_method'].includes(field)
        );

        // Iniciar transacción
        await client.query("BEGIN");

        // Actualizar usuario si hay campos válidos
        if (userFields.length > 0) {
            const updateSetClauses = userFields.map((field, index) => 
                `${field} = $${index + 1}`
            ).join(', ');

            const queryValues = userFields.map(field => updateData[field]);
            queryValues.push(id);

            await client.query(
                `UPDATE users 
                 SET ${updateSetClauses}, 
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $${queryValues.length} 
                 AND delete_at IS NULL`,
                queryValues
            );
        }

        // Actualizar cliente si hay campos válidos
        if (clientFields.length > 0) {
            const updateSetClauses = clientFields.map((field, index) => 
                `${field} = $${index + 1}`
            ).join(', ');

            const queryValues = clientFields.map(field => updateData[field]);
            queryValues.push(id);

            await client.query(
                `UPDATE client 
                 SET ${updateSetClauses}, 
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE user_id = $${queryValues.length}`,
                queryValues
            );
        }

        // Obtener el usuario y el cliente actualizados
        const userResult = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        const clientResult = await client.query('SELECT * FROM client WHERE user_id = $1', [id]);

        // Confirmar la transacción
        await client.query("COMMIT");

        // Devolver el usuario y el cliente actualizados
        return {
            user: userResult.rows[0],
            client: clientResult.rows[0] || null // Cliente asociado (si existe)
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error('Error al actualizar usuario:', error);
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    } finally {
        client.release();
    }
}

  static async delete(id) {
    const client = await pool.connect();
    
    try {
      // Iniciar transacción
      await client.query("BEGIN");
  
      // Realizar la eliminación lógica del usuario
      const result = await client.query(
        "UPDATE users SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
        [id]
      );
  
      // Verificar si el usuario fue encontrado y eliminado
      if (result.rowCount === 0) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
  
      // Confirmar la transacción
      await client.query("COMMIT");
  
      // Devolver el usuario eliminado
      return result.rows[0];
    } catch (error) {
      // Revertir la transacción en caso de error
      await client.query("ROLLBACK");
      console.error('Error al eliminar usuario:', error);
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    } finally {
      // Liberar el cliente de la pool
      client.release();
    }
  }
}