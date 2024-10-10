const pool = require('../config/db');

class DetailSale {
    static async create(saleId, productId, quantity) { 
        const result = await pool.query(
            'INSERT INTO detail_sale (saleid, productsid, quantity) VALUES ($1, $2, $3) RETURNING *', 
            [saleId, productId, quantity]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM detail_sale');
        return result.rows;
    }

    static async findBySaleId(saleId) {
        const result = await pool.query('SELECT * FROM detail_sale WHERE saleid = $1', [saleId]);
        return result.rows;
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM detail_sale WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = DetailSale;
