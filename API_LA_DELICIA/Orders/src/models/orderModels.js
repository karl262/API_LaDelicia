const pool = require('../config/db');
const axios = require('axios');


class Order {

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


static async findAll() {
  try {
    // 1. Consultar todas las órdenes y sus detalles
    const query = `
      SELECT 
        o.id, o.total, o.status, o.clientid, o.employeeid, o.payment_methodid, 
        o.discount, o.converted_to_sale, o.saleid, 
        o.order_date, o.estimated_completion_time, 
        o.created_at, o.updated_at, o.delete_at,
        od.id as order_detail_id, od.quantity, od.productsid, od.price_at_order, od.subtotal
      FROM orders o
      LEFT JOIN order_detail od ON o.id = od.orderid
      WHERE o.delete_at IS NULL
      ORDER BY o.created_at DESC;
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) return [];

    // Agrupar órdenes por ID
    const ordersMap = this.groupOrders(rows);

    // Obtener los IDs únicos de clientes, empleados y métodos de pago
    const clientIds = [...new Set(rows.map(row => row.clientid))];
    const employeeIds = [...new Set(rows.filter(row => row.employeeid).map(row => row.employeeid))];
    const paymentMethodIds = [...new Set(rows.map(row => row.payment_methodid))];

    // 2. Realizar las solicitudes externas para obtener datos adicionales
    const [clients, employees, paymentMethods] = await Promise.all([
      axios.post(`http://client-service:3000/api/clients/by-ids`, { ids: clientIds }),
      axios.post(`http://employee-service:3000/api/employees/by-ids`, { ids: employeeIds }),
      axios.post(`http://payment-service:3000/api/payment-methods/by-ids`, { ids: paymentMethodIds })
    ]);

    // Mapear los resultados
    const clientsData = this.mapById(clients.data);
    const employeesData = this.mapById(employees.data);
    const paymentMethodsData = this.mapById(paymentMethods.data);

    // Enriquecer las órdenes con la información adicional
    return ordersMap.map(order => ({
      ...order,
      client: clientsData[order.clientid] || null,
      employee: employeesData[order.employeeid] || null,
      payment_method: paymentMethodsData[order.payment_methodid] || null
    }));

  } catch (error) {
    console.error('Error al obtener todas las órdenes:', error.message);
    throw new Error('Error al obtener todas las órdenes y sus datos relacionados');
  }
}



//crear una orden
/*
static async create(orderData) {
  try {
      const { total, status, discount, estimated_completion_time } = orderData;
      const query = `
          INSERT INTO orders (total, status,  discount, estimated_completion_time)
          VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const result = await pool.query(query, [total, status, discount,  estimated_completion_time]);
      return result.rows[0];
  } catch (error) {
      console.error('Error al crear el pedido:', error);
      throw new Error('Error al crear el pedido');
  }
}*/
  
      // Eliminar un pedido (soft delete)
      static async delete(id) {
          try {
              const query = 'UPDATE orders SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
              const result = await pool.query(query, [id]);
              return result.rows[0];
          } catch (error) {
              console.error('Error al eliminar el pedido:', error);
              throw new Error('Error al eliminar el pedido');
          }
      }

      //obtener pedido por id
      static async getOrderById(orderId) {
        try {
          // 1. Obtener la orden y sus detalles desde la base de datos
          const query = `
            SELECT o.*, od.* 
            FROM orders o
            LEFT JOIN order_detail od ON o.id = od.orderid
            WHERE o.id = $1 AND o.delete_at IS NULL
          `;
          const { rows } = await pool.query(query, [orderId]);
          if (rows.length === 0) return null;
    
          // Formatear los datos de la orden y los detalles
          const order = this.formatOrderResults(rows);
    
          // 2. Realizar solicitudes a las APIs externas
          const [clientResponse, employeeResponse, paymentMethodResponse] = await Promise.all([
            axios.get(`http://client-service:3000/api/clients/${order.clientid}`),
            order.employeeid ? axios.get(`http://employee-service:3000/api/employees/${order.employeeid}`) : Promise.resolve({ data: null }),
            axios.get(`http://payment-service:3000/api/payment-methods/${order.payment_methodid}`)
          ]);
    
          // 3. Extraer la información de las respuestas
          const clientData = clientResponse.data;
          const employeeData = employeeResponse.data;
          const paymentMethodData = paymentMethodResponse.data;
    
          // 4. Combinar todos los datos en un objeto final
          return {
            ...order,
            client: clientData,
            employee: employeeData,
            payment_method: paymentMethodData
          };
    
        } catch (error) {
          console.error('Error al obtener la orden:', error);
          throw new Error('Error al obtener la orden y sus datos relacionados');
        }
      }
    
      // Formatear los resultados de la consulta de la base de datos
      static formatOrderResults(rows) {
        const order = {
          id: rows[0].id,
          total: rows[0].total,
          status: rows[0].status,
          clientid: rows[0].clientid,
          employeeid: rows[0].employeeid,
          payment_methodid: rows[0].payment_methodid,
          discount: rows[0].discount,
          converted_to_sale: rows[0].converted_to_sale,
          saleid: rows[0].saleid,
          order_date: rows[0].order_date,
          estimated_completion_time: rows[0].estimated_completion_time,
          created_at: rows[0].created_at,
          updated_at: rows[0].updated_at,
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
}


module.exports = Order; 