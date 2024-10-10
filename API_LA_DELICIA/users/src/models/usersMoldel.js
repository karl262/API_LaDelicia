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
            'SELECT * FROM users WHERE name ILIKE $1 AND delete_at IS NULL', [`%${name}%`]
        );
        return result.rows;
    }

    static async create(name, email) {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        return result.rows[0];
    }

    static async update(id, name, email) {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, update_at = CURRENT_TIMESTAMP WHERE id = $3 AND delete_at IS NULL RETURNING *',
            [name, email, id]
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
