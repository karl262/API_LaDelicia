import { pool } from "../config/db.js";
import SaleModel from "../models/saleModel.js";

export default class SaleController {
  static async createSaleFromOrder(req, res) {
    try {
      const { order } = req.body;

      if (!order) {
        throw new Error("Datos incompletos para crear la venta");
      }
      const saleId = await SaleModel.createFromOrder(order);

      res.status(200).json({
        success: true,
        saleId,
        message: "Venta creada exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getSales(req, res) {
    try {
      const sales = await SaleModel.findAll();
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSaleById(req, res) {
    try {
      const saleId = req.params.id;
      const sale = await SaleModel.findById(saleId);
      
      if (sale && sale.length > 0) {
        // Return the first (and presumably only) row with all details
        const saleData = sale[0];
        res.status(200).json({
          id: saleData.id,
          orderid: saleData.orderid,
          total: saleData.total,
          discount: saleData.discount || "0",
          final_total: saleData.final_total,
          clientid: saleData.clientid,
          payment_methodid: saleData.payment_methodid,
          sale_date: saleData.sale_date,
          created_at: saleData.created_at,
          updated_at: saleData.updated_at,
          delete_at: saleData.delete_at,
          saleid: saleData.id,
          productid: saleData.productid,
          quantity: saleData.quantity,
          price_at_sale: saleData.price_at_sale,
          subtotal: saleData.subtotal
        });
      } else {
        res.status(404).json({ message: "Venta no encontrada" });
      }
    } catch (error) {
      console.error('Error retrieving sale:', error);
      res.status(500).json({ 
        message: "Error interno del servidor", 
        error: error.message 
      });
    }
  }

  static async deleteSale(req, res) {
    try {
      const deletedSale = await SaleModel.delete(req.params.id);
      if (deletedSale) {
        res.status(200).json(deletedSale);
      } else {
        res.status(404).json({ message: "Venta no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSalesByClientId(req, res) {
    try {
      const sales = await SaleModel.getSalesByClientId(req.params.clientId);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
