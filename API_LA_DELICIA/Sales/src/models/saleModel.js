const pool = require('../config/db');

class Sale {
    static async create(total, discount) {
        const result = await pool.query(
            'INSERT INTO sale (total, discount) VALUES ($1, $2) RETURNING *',
            [total, discount]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM sale WHERE delete_at IS NULL'); // Filtrar eliminados
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM sale WHERE id = $1 AND delete_at IS NULL', [id]); // Filtrar eliminados
        return result.rows[0];
    }

    static async update(id, total, discount, paymentMethodId) {
        const result = await pool.query(
            'UPDATE sale SET total = $1, discount = $2, payment_methodid = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [total, discount, paymentMethodId, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('UPDATE sale SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', [id]); // Soft delete
        return result.rows[0];
    }
}

module.exports = Sale;
