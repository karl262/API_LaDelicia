const express = require('express');
const SaleController = require('../controllers/saleController.js');
const AuthMiddleware = require('../middlewares/auth.js')

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.post('/create/sale', SaleController.createSale);
router.get('/get/sales', SaleController.getSales);
router.get('/get/sales/by/id/:id', SaleController.getSaleById);
router.put('/update/sale/:id', SaleController.updateSale);
router.delete('/delete/sale/:id', SaleController.deleteSale);
router.post('/create-from-order', SaleController.createFromOrder);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'sale-service' });
});

module.exports = router;
