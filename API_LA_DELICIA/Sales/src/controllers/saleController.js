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
      const sale = await SaleModel.findById(req.params.id);
      if (sale) {
        const details = await SaleModel.findById(sale.id);
        res.status(200).json({ SaleModel, details });
      } else {
        res.status(404).json({ message: "Venta no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
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
