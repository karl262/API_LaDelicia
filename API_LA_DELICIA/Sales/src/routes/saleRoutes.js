import express from 'express';
import SaleController from '../controllers/saleController.js';
import authMiddleware from '../middlewares/auth.js'

const router = express.Router();

router.use(authMiddleware);

router.post('/create/sale', SaleController.createSale);
router.get('/get/sales', SaleController.getSales);
router.get('/get/sales/by/id/:id', SaleController.getSaleById);
router.put('/update/sale/:id', SaleController.updateSale);
router.delete('/delete/sale/:id', SaleController.deleteSale);
router.post('/create-from-order', SaleController.createSaleFromOrder);

export default router;
