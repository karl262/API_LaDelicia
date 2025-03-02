import OrderModel from "../models/orderModels.js";
import axios from "axios";
import PDFDocument from 'pdfkit';
import moment from 'moment';

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

  static async getOrderTicket(req, res) {
    const { id } = req.params;
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token de autenticación"
      });
    }

    try {
      const orderTicket = await OrderModel.getOrderForTicket(id, authToken);
      if (orderTicket) {
        res.status(200).json(orderTicket);
      } else {
        res.status(404).json({ 
          success: false,
          message: "Orden no encontrada para ticket" 
        });
      }
    } catch (error) {
      console.error('Error fetching order ticket:', error);
      
      // More detailed error response
      if (error.response) {
        // The request was made and the server responded with a status code
        res.status(error.response.status || 500).json({ 
          success: false, 
          message: "Error al obtener el ticket de la orden", 
          details: error.response.data,
          errorType: 'ServiceError'
        });
      } else if (error.request) {
        // The request was made but no response was received
        res.status(503).json({ 
          success: false, 
          message: "No se pudo conectar con los servicios", 
          errorType: 'NetworkError'
        });
      } else {
        // Something happened in setting up the request
        res.status(500).json({ 
          success: false, 
          message: "Error interno al procesar la solicitud", 
          errorType: 'InternalError'
        });
      }
    }
  }

  static async generateOrderTicketPDF(req, res) {
    const { id } = req.params;
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token de autenticación"
      });
    }

    try {
      // Fetch order ticket information
      console.log(`Fetching order ticket for ID: ${id}`);
      const orderTicket = await OrderModel.getOrderForTicket(id, authToken);
      
      if (!orderTicket) {
        console.warn(`No order found for ID: ${id}`);
        return res.status(404).json({ 
          success: false, 
          message: "Orden no encontrada" 
        });
      }

      console.log('Order ticket details:', JSON.stringify(orderTicket, null, 2));

      // Create a new PDF document
      const doc = new PDFDocument({ size: [300, 800], margin: 20 });
      
      // Prepare buffers to store PDF content
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      
      // Handle PDF generation completion
      doc.on('end', () => {
        try {
          const pdfData = Buffer.concat(buffers);
          
          // Set response headers for PDF download
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=ticket_orden_${id}.pdf`);
          res.setHeader('Content-Length', pdfData.length);
          
          // Send the PDF data
          res.send(pdfData);
        } catch (sendError) {
          console.error('Error sending PDF:', sendError);
          res.status(500).json({
            success: false,
            message: "Error al enviar el archivo PDF",
            errorDetails: sendError.message
          });
        }
      });

      // Error handling for PDF document
      doc.on('error', (pdfError) => {
        console.error('PDF generation error:', pdfError);
        res.status(500).json({
          success: false,
          message: "Error al generar el PDF",
          errorDetails: pdfError.message
        });
      });

      // PDF Content
      doc.font('Helvetica-Bold').fontSize(16).text('LA DELICIA', { align: 'center' });
      doc.font('Helvetica').fontSize(10).text('Ticket de la Orden', { align: 'center' });
      
      doc.moveDown();
      
      // Order Details
      doc.fontSize(10)
        .text(`Fecha: ${moment(orderTicket.created_at).format('DD/MM/YYYY HH:mm')}`)
        .text(`Estado: ${orderTicket.status}`);
      
      doc.moveDown();
      
      // Client Details
      doc.font('Helvetica-Bold').text('Información del Cliente:');
      doc.font('Helvetica')
        .text(`Nombre: ${orderTicket.client.name}`)
        .text(`Teléfono: ${orderTicket.client.phone}`);
      
      doc.moveDown();
      
      // Order Items
      doc.font('Helvetica-Bold').text('Detalles de la Orden:');
      doc.font('Helvetica');
      
      orderTicket.details.forEach(item => {
        // Product details
        const productName = item.product.name;
        const price = Number(item.price_at_order).toFixed(2);
        const quantity = item.quantity;
        const subtotal = Number(item.subtotal).toFixed(2);

        // Print product details
        doc.text(
          `${productName} x${quantity} - $${price}`, 
          { lineBreak: true }
        );
        
        // Print ingredients if available
        if (item.product.ingredients && item.product.ingredients !== 'Información no disponible') {
          doc.text(`Ingredientes: ${item.product.ingredients}`, { lineBreak: true });
        }
        
        // Print subtotal
        doc.text(`Subtotal: $${subtotal}`, { lineBreak: true });
        
        doc.moveDown(0.5);
      });
      
      doc.moveDown();
      
      // Total
      const total = Number(orderTicket.total).toFixed(2);
      doc.font('Helvetica-Bold').text(`Total: $${total}`, { align: 'right' });
      
      // Finalize PDF
      doc.end();

    } catch (error) {
      console.error('Comprehensive error details:', {
        message: error.message,
        stack: error.stack,
        responseData: error.response?.data,
        responseStatus: error.response?.status
      });
      
      // More detailed error response
      if (error.response) {
        res.status(error.response.status || 500).json({ 
          success: false, 
          message: "Error al generar el ticket PDF", 
          details: error.response.data,
          errorType: 'ServiceError'
        });
      } else if (error.request) {
        res.status(503).json({ 
          success: false, 
          message: "No se pudo conectar con los servicios", 
          errorType: 'NetworkError'
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Error interno al procesar la solicitud", 
          errorDetails: error.message,
          errorType: 'InternalError'
        });
      }
    }
  }
}

export default OrderController;
