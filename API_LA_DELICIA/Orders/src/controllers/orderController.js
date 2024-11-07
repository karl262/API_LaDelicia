const User = require('../models/usersMoldel');
const { body, validationResult } = require('express-validator');

class OrderController {
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
  }

module.exports = OrderController;