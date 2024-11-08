const pool = require('../config/db.js'); 
const Sale = require('../models/saleModel.js');
const SaleDetail = require('../models/detailSaleModel.js'); 

class SaleController {
    static async createFromOrder(req, res) {
        try {
          const { order, employeeId } = req.body;
    
          if (!order || !employeeId) {
            throw new Error('Datos incompletos para crear la venta');
          }
    
          const saleId = await SaleModel.createFromOrder(order, employeeId);
    
          res.status(200).json({
            success: true,
            saleId,
            message: 'Venta creada exitosamente'
          });
    
        } catch (error) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        }
    }
    
    static async createSale(req, res) {
        const { total, discount, details } = req.body; 
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); 

            // Crear la venta
            const sale = await Sale.create(total, discount); 

            // Crear los detalles de la venta
            const detailPromises = details.map(detail => 
                SaleDetail.create(sale.id, detail.quantity) // Se asume que detail.quantity es un número
            );
            await Promise.all(detailPromises); // Esperar a que se creen todos los detalles

            await client.query('COMMIT'); 
            res.status(201).json({ sale, details });
        } catch (error) {
            await client.query('ROLLBACK'); 
            res.status(500).json({ error: error.message });
        } finally {
            client.release(); 
        }
    }

    static async getSales(req, res) {
        try {
            const sales = await Sale.findAll();
            res.status(200).json(sales);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSaleById(req, res) {
        try {
            const sale = await Sale.findById(req.params.id);
            if (sale) {
                const details = await SaleDetail.findBySaleId(sale.id); // Obtener detalles de la venta
                res.status(200).json({ sale, details });
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateSale(req, res) {
        const { total, discount, paymentMethodId } = req.body; // Se espera que se envíen estos campos

        try {
            const updatedSale = await Sale.update(req.params.id, total, discount, paymentMethodId);
            if (updatedSale) {
                res.status(200).json(updatedSale);
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteSale(req, res) {
        try {
            const deletedSale = await Sale.delete(req.params.id);
            if (deletedSale) {
                res.status(200).json(deletedSale);
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SaleController;
