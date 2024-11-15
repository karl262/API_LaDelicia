import { pool } from '../config/db.js';

export default class Sale {
  static async createFromOrder(order) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const saleQuery = `
            INSERT INTO sales (orderid, total, clientid, employeeid, payment_methodid)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const { rows } = await client.query(saleQuery, [
            order.id,
            order.total,
            order.clientid,
            order.employeeid,
            order.payment_methodid,
        ]);
        const saleId = rows[0].id;

        for (const detail of order.details) {
            const detailQuery = `
                INSERT INTO sale_details (saleid, productid, quantity, price_at_sale)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(detailQuery, [
                saleId,
                detail.productsid,
                detail.quantity,
                detail.price_at_order
            ]);
        }

        await client.query('COMMIT');
        return saleId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
  }

    static async findAll() {
        const result = await pool.query('SELECT * FROM sales WHERE delete_at IS NULL'); // Filtrar eliminados
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM sales WHERE id = $1 AND delete_at IS NULL', [id]); // Filtrar eliminados
        return result.rows[0];
    }
    
    static async update(id, total, discount, paymentMethodId) {
        const result = await pool.query(
            'UPDATE sales SET total = $1, discount = $2, payment_methodid = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [total, discount, paymentMethodId, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('UPDATE sales SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', [id]); // Soft delete
        return result.rows[0];
    }
}