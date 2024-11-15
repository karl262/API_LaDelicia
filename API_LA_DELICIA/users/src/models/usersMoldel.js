import { pool } from '../config/db.js';
import  axios  from 'axios';

export default class User {
    static async findAll() {
        try {
            const result = await pool.query('SELECT * FROM users WHERE delete_at IS NULL');
            if (result.rows.length === 0) {
                return [];
            }
            
            const userData = result.rows;
            const authUserIds = userData.map(user => user.auth_user_id);
            const responses = await Promise.all(authUserIds.map(authUserId => axios.get(`http://auth-service:3000/api/auths/get/auth/by/${authUserId}`)));
            const authData = responses.map(response => response.data);
            const combinedData = userData.map((user, index) => ({ user, auth: authData[index] }));
            return combinedData;
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            throw new Error('Error al buscar usuarios en la base de datos');
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1 AND delete_at IS NULL', [id]);
            const userData = result.rows[0];
            const authUserId = userData.auth_user_id;
            const response = await axios.get(`http://auth-service:3000/api/auth/by/${authUserId}`);
            const authData = response.data;
            return { user: userData, auth: authData };
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            throw new Error('Error al buscar usuarios en la base de datos');
        }
    }

    static async findByUserName(name) {
        const result = await pool.query(
            'SELECT * FROM users WHERE first_name ILIKE $1 AND delete_at IS NULL', [`%${name}%`]
        );
        return result.rows;
    }

    static async create(first_name, last_name, date_of_birth, phone_number, preferred_payment_method, auth_user_id) {
        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, date_of_birth, phone_number, preferred_payment_method, auth_user_id, updated_at) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *', // Agregado updated_at
            [first_name, last_name, date_of_birth, phone_number, preferred_payment_method, auth_user_id]
        );
        return result.rows[0];
    }

    static async update(id, first_name, last_name, date_of_birth, phone_number, preferred_payment_method) {
        const result = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, phone_number = $4, preferred_payment_method = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND delete_at IS NULL RETURNING *', // Corregido update_at a updated_at
            [first_name, last_name, date_of_birth, phone_number, preferred_payment_method, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query(
            'UPDATE users SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}

// export default User;
