import OrderModel from '../models/orderModels.js';
import axios from 'axios';

class OrderController {
    static async convertOrderToSale(req, res) {
        const { orderId } = req.params;

        try {
            // Iniciar transacción
            await OrderModel.beginTransaction();

            // Validar pedido
            const order = await OrderModel.getOrderById(orderId);
            if (!order) throw new Error('Pedido no encontrado');
            if (order.status !== 'listo para recoger') {
                throw new Error('El estado del pedido no es "listo para recoger"');
            }
            if (order.converted_to_sale) {
                throw new Error('El pedido ya ha sido convertido a venta');
            }

            // Llamada al microservicio de ventas
            const saleResponse = await axios.post(
                'http://sale-service:3000/api/sales/create-from-order',
                { order },
                { headers: { 'Authorization': req.headers.authorization } }
            );

            const { saleId } = saleResponse.data;

            if (!saleId) throw new Error('No se obtuvo el ID de la venta');

            // Actualizar el pedido como vendido
            await OrderModel.markOrderAsSold(orderId, saleId);

            // Confirmar transacción
            await OrderModel.commitTransaction();

            res.status(200).json({
                success: true,
                message: 'Pedido convertido a venta exitosamente',
                saleId
            });
        } catch (error) {
            await OrderModel.rollbackTransaction();
            res.status(400).json({
                success: false,
                message: error.response?.data?.message || error.message
            });
        }
    }
  
    static async createOrder(req, res) {
    const { clientid, employeeid, payment_methodid, total, details } = req.body;

    // Validación básica de campos necesarios
    if (!clientid || !details || details.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: clientid o detalles de la orden'
      });
    }

    try {
      // Crear la orden y obtener el ID de la orden creada
      const result = await OrderModel.createOrder({ clientid, employeeid, payment_methodid, total, details });
      
      res.status(201).json({
        success: true,
        message: 'Orden creada exitosamente',
        orderId: result.orderId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear la orden',
        error: error.message
      });
    }
  }

  static async getOrders(req, res) {
    try {
      const orders = await OrderModel.findAll();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderById(req, res) {
    const { id } = req.params;
    try {
      const order = await OrderModel.getOrderById(id);
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: 'Orden no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const newStatus = 'listo para recoger';

    try {
      const updatedOrder = await OrderModel.updateOrderStatus(orderId, newStatus);
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'El estado de la orden ha sido actualizado a "listo para recoger"',
        order: updatedOrder
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado de la orden',
        error: error.message
      });
    }
  }
}

export default OrderController;