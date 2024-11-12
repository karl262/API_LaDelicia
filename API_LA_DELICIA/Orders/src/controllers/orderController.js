const OrderModel = require('../models/orderModels')


class OrderController {

  // Convertir una orden a una venta
    static async convertOrderToSale(req, res) {
      const { orderId } = req.params;
      const pool = require('../config/database');
      const client = await pool.connect();
  
      try {
        await client.query('BEGIN');
  
        const order = await OrderModel.getOrderById(orderId);
        
        if (!order) {
          throw new Error('Pedido no encontrado');
        }
  
        if (order.status !== 'listo para recoger' || order.converted_to_sale) {
          throw new Error('Pedido no válido para conversión a venta');
        }
  
        // Llamar al microservicio de ventas
        const saleResponse = await axios.post(
          'http://sale-service:3000/api/sales/create-from-order',
          {
            order: order,
            employeeId: req.user.id // Del token validado
          },
          {
            headers: {
              'Authorization': req.headers.authorization
            }
          }
        );
  
        const { saleId } = saleResponse.data;
  
        await OrderModel.markOrderAsSold(orderId, saleId);
  
        await client.query('COMMIT');
  
        res.status(200).json({
          success: true,
          message: 'Pedido convertido a venta exitosamente',
          saleId
        });
  
      } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({
          success: false,
          message: error.message
        });
      } finally {
        client.release();
      }
    }


    
// Crear un nuevo pedido
        static async createOrder(req, res) {
          try {
              const order = await Order.create(req.body);
              res.status(201).json(order);
          } catch (error) {
              res.status(500).json({ error: error.message });
          }
      }
  
  // Obtener todos los pedidos
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.findAll(); // Usar el modelo correcto
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error al obtener todas las órdenes:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
      
  
      // Obtener un pedido por ID
      static async getOrderById(req, res) {
        try {
          const order = await OrderModel.getOrderById(req.params.id);
          if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
          }
          res.status(200).json(order);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
  
  
      // Eliminar un pedido
      static async deleteOrder(req, res) {
          try {
              const order = await Order.delete(req.params.id);
              if (!order) {
                  return res.status(404).json({ message: 'Pedido no encontrado' });
              }
              res.status(200).json({ message: 'Pedido eliminado con éxito' });
          } catch (error) {
              res.status(500).json({ error: error.message });
          }
      }


  }

module.exports = OrderController;