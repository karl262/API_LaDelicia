import { pool } from "../config/db.js";

export default class OrderModel {
  static async beginTransaction() {
    const client = await pool.connect();
    await client.query("BEGIN");
    this.client = client;
  }

  static async commitTransaction() {
    await this.client.query("COMMIT");
    this.client.release();
  }

  static async rollbackTransaction() {
    await this.client.query("ROLLBACK");
    this.client.release();
  }

  static async getOrderById(orderId) {
    const client = await pool.connect();
    try {
      const query = `
                SELECT o.*, od.* 
                FROM orders o JOIN order_detail od ON o.id = od.orderid
                WHERE o.id = $1 AND o.delete_at IS NULL
            `;
      const { rows } = await client.query(query, [orderId]);
      return this.formatOrderResults(rows);
    } finally {
      client.release();
    }
  }

  static async markOrderAsSold(orderId, saleId) {
    const query = `
            UPDATE orders 
            SET converted_to_sale = true, 
                saleid = $1,
                status = 'recogido',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND delete_at IS NULL RETURNING *;
        `;
    const { rows } = await this.client.query(query, [saleId, orderId]);
    return rows[0];
  }

  static formatOrderResults(rows) {
    if (rows.length === 0) return null;

    const order = {
      id: rows[0].orderid,
      total: rows[0].total,
      status: rows[0].status,
      clientid: rows[0].clientid,
      payment_methodid: rows[0].payment_methodid,
      details: [],
    };

    rows.forEach((row) => {
      order.details.push({
        id: row.id,
        orderid: row.orderid,
        quantity: row.quantity,
        productsid: row.productsid,
        price_at_order: row.price_at_order,
        subtotal: row.subtotal,
      });
    });

    return order;
  }

  static async createOrder(orderData) {
    const { clientid, total, details } = orderData;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderQuery = `
        INSERT INTO orders (clientid, payment_methodid, total, status)
        VALUES ($1, 1, $2, 'pendiente')
        RETURNING id
      `;
      const orderResult = await client.query(orderQuery, [clientid, total]);
      const orderId = orderResult.rows[0].id;

      const detailQuery = `
        INSERT INTO order_detail (orderid, productsid, quantity, price_at_order)
        VALUES ($1, $2, $3, $4)
      `;
      for (const detail of details) {
        const { productsid, quantity, price_at_order } = detail;
        await client.query(detailQuery, [
          orderId,
          productsid,
          quantity,
          price_at_order,
        ]);
      }

      await client.query("COMMIT");
      return { orderId };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateOrderStatus(orderId, newStatus) {
    const query = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const values = [newStatus, orderId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
