import { pool } from "../config/db.js";
import axios from "axios";

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

  static formatOrderResultsClient(rows) {
    const orders = {};

    rows.forEach(row => {
        const orderId = row.orderid;
        if (!orders[orderId]) {
            orders[orderId] = {
                id: row.orderid,
                total: row.total,
                status: row.status,
                clientid: row.clientid,
                payment_methodid: row.payment_methodid,
                details: []
            };
        }
        orders[orderId].details.push({
            id: row.id,
            orderid: row.orderid,
            quantity: row.quantity,
            productsid: row.productsid,
            price_at_order: row.price_at_order,
            subtotal: row.subtotal
        });
    });

    return Object.values(orders); 
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

  static async getOrdersByClient(clientid) {
    const query = `
      SELECT o.*, od.* 
      FROM orders o JOIN order_detail od ON o.id = od.orderid
      WHERE o.clientid = $1 AND o.delete_at IS NULL
    `;
    const { rows } = await pool.query(query, [clientid]);
    if (rows.length === 0) {
        throw new Error('No orders found for this client ID');
    }
    return this.formatOrderResultsClient(rows);
  }

  static async getOrderForTicket(orderId, authToken) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          o.id AS order_id, 
          o.total, 
          o.status, 
          o.created_at,
          o.clientid,
          o.payment_methodid,
          od.id AS detail_id,
          od.productsid,
          od.quantity,
          od.price_at_order,
          od.subtotal
        FROM orders o
        JOIN order_detail od ON o.id = od.orderid
        WHERE o.id = $1 AND o.delete_at IS NULL
      `;
      const { rows } = await client.query(query, [orderId]);
      
      if (rows.length === 0) return null;

      // Prepare axios config with authentication
      const axiosConfig = {
        headers: { 
          Authorization: authToken 
        }
      };

      // Fetch client details from user service
      const clientResponse = await axios.get(
        `${process.env.USERS_SERVICE_URL}/api/users/get/users/by/${rows[0].clientid}`,
        axiosConfig
      );

      // Fetch product details for each order item with error handling
      const productPromises = rows.map(async (row) => {
        try {
          const response = await axios.get(
            `${process.env.PRODUCTS_SERVICE_URL}/api/products/get/products/by/id/${row.productsid}`, 
            axiosConfig
          );
          return response.data;
        } catch (error) {
          console.warn(`Product ${row.productsid} not found:`, error.response?.data?.message);
          // Return a default product object if product is not found
          return {
            id: row.productsid,
            name_product: 'Producto no disponible',
            price_product: row.price_at_order,
            ingredients: 'Información no disponible'
          };
        }
      });

      const productResponses = await Promise.all(productPromises);

      return this.formatOrderTicket(
        rows, 
        clientResponse.data, 
        productResponses
      );
    } catch (error) {
      console.error('Error fetching order ticket details:', error.response ? error.response.data : error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static formatOrderTicket(rows, clientData, productData) {
    if (rows.length === 0) return null;

    const orderTicket = {
      order_id: rows[0].order_id,
      total: rows[0].total,
      status: rows[0].status,
      created_at: rows[0].created_at,
      client: {
        id: clientData.userData.id,
        name: `${clientData.userData.name} ${clientData.userData.first_surname} ${clientData.userData.last_surname}`,
        phone: clientData.userData.phone_number || 'No disponible'
      },
      details: rows.map((row, index) => ({
        detail_id: row.detail_id,
        product: {
          id: productData[index].id,
          name: productData[index].name_product,
          price: productData[index].price_product,
          ingredients: productData[index].ingredients
        },
        quantity: row.quantity,
        price_at_order: row.price_at_order,
        subtotal: row.subtotal
      }))
    };

    return orderTicket;
  }
}
