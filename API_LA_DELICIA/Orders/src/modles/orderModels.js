const pool = require('../config/db');

class OrderModel {

    static async getOrderById(orderId) {
      const query = `
        SELECT o.*, od.* 
        FROM orders o
        LEFT JOIN order_detail od ON o.id = od.orderid
        WHERE o.id = $1 AND o.delete_at IS NULL
      `;
      const { rows } = await pool.query(query, [orderId]);
      return this.formatOrderResults(rows);
    }
  
    static formatOrderResults(rows) {
      if (rows.length === 0) return null;
      
      const order = {
        id: rows[0].id,
        total: rows[0].total,
        status: rows[0].status,
        clientid: rows[0].clientid,
        employeeid: rows[0].employeeid,
        payment_methodid: rows[0].payment_methodid,
        details: []
      };
  
      rows.forEach(row => {
        if (row.orderid) {
          order.details.push({
            id: row.id,
            quantity: row.quantity,
            productsid: row.productsid,
            price_at_order: row.price_at_order,
            subtotal: row.subtotal
          });
        }
      });
  
      return order;
    }
  
    static async markOrderAsSold(orderId, saleId) {
      const query = `
        UPDATE orders 
        SET converted_to_sale = true, 
            saleid = $1,
            status = 'recogido',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND delete_at IS NULL
        RETURNING *
      `;
      const { rows } = await pool.query(query, [saleId, orderId]);
      return rows[0];
    }
}

module.exports = Order; 