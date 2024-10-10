const pool = require('../config/db');

class Sale {
    static async create(total, discount, clientId, employeeId, paymentMethodId) {
        const result = await pool.query(
            'INSERT INTO sale (total, discount, clientid, employeeid, payment_methodid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [total, discount, clientId, employeeId, paymentMethodId]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM sale');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM sale WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, total, discount, clientId, employeeId, paymentMethodId) {
        const result = await pool.query(
            'UPDATE sale SET total = $1, discount = $2, clientid = $3, employeeid = $4, payment_methodid = $5 WHERE id = $6 RETURNING *',
            [total, discount, clientId, employeeId, paymentMethodId, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM sale WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = Sale;
