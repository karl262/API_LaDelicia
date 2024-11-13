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




    //obtiene todos los pedidos con sus detalles(order detail)
    static async findAll() {
      try {
        // 1. Consultar todas las órdenes y sus detalles
        const query = `
          SELECT o.*, od.* 
          FROM orders o
          LEFT JOIN order_detail od ON o.id = od.orderid
          WHERE o.delete_at IS NULL
          ORDER BY o.created_at DESC`;
        const { rows } = await pool.query(query);
        if (rows.length === 0) return [];
        const ordersMap = this.groupOrders(rows);
        const clientIds = [...new Set(rows.map(row => row.clientid))];
        const employeeIds = [...new Set(rows.filter(row => row.employeeid).map(row => row.employeeid))];
        const paymentMethodIds = [...new Set(rows.map(row => row.payment_methodid))];
        const [clientsResponse, employeesResponse, paymentMethodsResponse] = await Promise.all([
          axios.get(`http://client-service:3000/api/clients/by-ids`, { data: { ids: clientIds } }),
          axios.get(`http://employee-service:3000/api/employees/by-ids`, { data: { ids: employeeIds } }),
          axios.get(`http://payment-service:3000/api/payment-methods/by-ids`, { data: { ids: paymentMethodIds } })
        ]);
  
        // 5. Mapear los resultados de las APIs externas a objetos más accesibles
        const clientsData = this.mapById(clientsResponse.data);
        const employeesData = this.mapById(employeesResponse.data);
        const paymentMethodsData = this.mapById(paymentMethodsResponse.data);
  
        // 6. Enriquecer los datos de las órdenes con la información obtenida
        const enrichedOrders = ordersMap.map(order => ({
          ...order,
          client: clientsData[order.clientid] || null,
          employee: employeesData[order.employeeid] || null,
          payment_method: paymentMethodsData[order.payment_methodid] || null
        }));
  
        return enrichedOrders;
      } catch (error) {
        console.error('Error al obtener todas las órdenes:', error);
        throw new Error('Error al obtener todas las órdenes y sus datos relacionados');
      }
    }
  
    // Agrupar las órdenes por su ID
    static groupOrders(rows) {
      const ordersMap = new Map();
  
      rows.forEach(row => {
        if (!ordersMap.has(row.id)) {
          ordersMap.set(row.id, {
            id: row.id,
            total: row.total,
            status: row.status,
            clientid: row.clientid,
            employeeid: row.employeeid,
            payment_methodid: row.payment_methodid,
            discount: row.discount,
            converted_to_sale: row.converted_to_sale,
            saleid: row.saleid,
            order_date: row.order_date,
            estimated_completion_time: row.estimated_completion_time,
            created_at: row.created_at,
            updated_at: row.updated_at,
            details: []
          });
        }
  
        const order = ordersMap.get(row.id);
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
  
      return Array.from(ordersMap.values());
    }
  
    // Utilidad para mapear resultados por ID
    static mapById(dataArray) {
      return dataArray.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
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