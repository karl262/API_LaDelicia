const pool = require('../config/db.js');

class DetailSale {
    static async create(saleId, quantity) { 
        const result = await pool.query(
            'INSERT INTO detail_sale (saleid, quantity) VALUES ($1, $2) RETURNING *', 
            [saleId, quantity]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM detail_sale WHERE delete_at IS NULL'); // Filtrar eliminados
        return result.rows;
    }

    static async findBySaleId(saleId) {
        const result = await pool.query('SELECT * FROM detail_sale WHERE saleid = $1 AND delete_at IS NULL', [saleId]); // Filtrar eliminados
        return result.rows;
    }

    static async delete(id) {
        const result = await pool.query('UPDATE detail_sale SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', [id]); // Soft delete
        return result.rows[0];
    }
}

module.exports = DetailSale;
