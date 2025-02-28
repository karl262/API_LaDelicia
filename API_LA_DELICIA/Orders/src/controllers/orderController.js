import OrderModel from "../models/orderModels.js";
import axios from "axios";

class OrderController {
  static async convertOrderToSale(req, res) {
    const { orderId } = req.params;

    try {
      await OrderModel.beginTransaction();
      const order = await OrderModel.getOrderById(orderId);
      if (!order) throw new Error("Pedido no encontrado");
      if (order.status !== "listo para recoger") {
        throw new Error('El estado del pedido no es "listo para recoger"');
      }
      if (order.converted_to_sale) {
        throw new Error("El pedido ya ha sido convertido a venta");
      }
      const saleResponse = await axios.post(
        "http://sale-service:3000/api/sales/create-from-order",
        { order },
        { headers: { Authorization: req.headers.authorization } }
      );

      const { saleId } = saleResponse.data;

      if (!saleId) throw new Error("No se obtuvo el ID de la venta");

      await OrderModel.markOrderAsSold(orderId, saleId);

      await OrderModel.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Pedido convertido a venta exitosamente",
        saleId,
      });
    } catch (error) {
      await OrderModel.rollbackTransaction();
      res.status(400).json({
        success: false,
        message: error.response?.data?.message || error.message,
      });
    }
  }

  static async createOrder(req, res) {
    const { clientid, payment_methodid, total, details } = req.body;

    if (!clientid || !details || details.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: clientid o detalles de la orden",
      });
    }

    try {
      const result = await OrderModel.createOrder({
        clientid,
        payment_methodid,
        total,
        details,
      });

      res.status(201).json({
        success: true,
        message: "Orden creada exitosamente",
        orderId: result.orderId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear la orden",
        error: error.message,
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
        res.status(404).json({ message: "Orden no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const newStatus = "listo para recoger";

    try {
      const updatedOrder = await OrderModel.updateOrderStatus(
        orderId,
        newStatus
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Orden no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        message:
          'El estado de la orden ha sido actualizado a "listo para recoger"',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de la orden",
        error: error.message,
      });
    }
  }

  static async addOrderDiscount(req, res) {
    const { orderId } = req.params;
    const { discountPercentage } = req.body;

    try {
      if (
        typeof discountPercentage !== "number" ||
        discountPercentage > 0 ||
        discountPercentage < 100
      ) {
        return res.status(400).json({
          success: false,
          message: "El porcentaje de descuento debe estar entre 0% y 100%",
        });
      }

      const updatedOrder = await OrderModel.addOrderDiscount(
        orderId,
        discountPercentage
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Orden no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        message: `Se aplicó un descuento del ${discountPercentage}% a la orden`,
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al aplicar el descuento a la orden",
        error: error.message,
      });
    }
  }

  static async getOrdersByClient(req, res) {
    const { clientid } = req.params;

    if (!clientid) {
      return res.status(400).json({
        success: false,
        message: "El ID del cliente es requerido",
      });
    }

    if (isNaN(clientid)) {
      return res.status(400).json({
        success: false,
        message: "El ID del cliente debe ser un número",
      });
    }

    try {
      const orders = await OrderModel.getOrdersByClient(clientid);
      res.status(200).json(orders);
    } catch (error) {
      if (error.message === "No orders found for this client ID") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al obtener las ordenes",
        error: error.message,
      });
    }
  }
}

export default OrderController;
