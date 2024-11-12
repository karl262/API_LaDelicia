const pool = require('../config/db.js');

class Sale {

    static async createFromOrder(orderData, employeeId) {
        const client = await pool.connect();
        
        try {
          await client.query('BEGIN');
    
          const saleQuery = `
            INSERT INTO sale (
              orderid, total, discount, final_total,
              clientid, employeeid, payment_methodid,
              sale_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
            RETURNING id
          `;
    
          const saleValues = [
            orderData.id,
            orderData.total,
            orderData.discount || 0,
            orderData.total - (orderData.discount || 0),
            orderData.clientid,
            employeeId,
            orderData.payment_methodid
          ];
    
          const { rows: [sale] } = await client.query(saleQuery, saleValues);
    
          // Crear detalles de venta
          for (const detail of orderData.details) {
            await client.query(`
              INSERT INTO detail_sale (
                saleid, productid, quantity, 
                price_at_sale, subtotal,
                sale_date
              ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            `, [
              sale.id,
              detail.productsid,
              detail.quantity,
              detail.price_at_order,
              detail.subtotal
            ]);
          }
    
          await client.query('COMMIT');
          return sale.id;
    
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      }
      
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
