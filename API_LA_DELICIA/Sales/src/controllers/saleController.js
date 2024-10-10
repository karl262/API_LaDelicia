const pool = require('../config/db'); 
const Sale = require('../models/saleModel');
const SaleDetail = require('../models/detailSaleModel'); 

class SaleController {
    static async createSale(req, res) {
        const { total, discount, clientId, employeeId, paymentMethodId, details } = req.body;
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); 

            const sale = await Sale.create(total, discount, clientId, employeeId, paymentMethodId); 

            for (let detail of details) {
                await SaleDetail.create(sale.id, detail.productId, detail.quantity); 
            }

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
                res.status(200).json(sale);
            } else {
                res.status(404).json({ message: 'Sale not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateSale(req, res) {
        const { total, discount, clientId, employeeId, paymentMethodId } = req.body;

        try {
            const updatedSale = await Sale.update(req.params.id, total, discount, clientId, employeeId, paymentMethodId);
            res.status(200).json(updatedSale);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteSale(req, res) {
        try {
            const deletedSale = await Sale.delete(req.params.id);
            res.status(200).json(deletedSale);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SaleController;
