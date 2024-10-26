const pool = require('../config/db');

class User {
    static async findAll() {
        try {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            throw new Error('Error al buscar usuarios en la base de datos');
        }
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1 AND delete_at IS NULL', [id]);
        return result.rows[0];
    }

    static async findByUserName(name) {
        const result = await pool.query(
            'SELECT * FROM users WHERE first_name ILIKE $1 AND delete_at IS NULL', [`%${name}%`]
        );
        return result.rows;
    }

    static async create(first_name, last_name, date_of_birth, phone_number, preferred_payment_method) {
        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, date_of_birth, phone_number, preferred_payment_method, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *', // Agregado updated_at
            [first_name, last_name, date_of_birth, phone_number, preferred_payment_method]
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
module.exports = User;