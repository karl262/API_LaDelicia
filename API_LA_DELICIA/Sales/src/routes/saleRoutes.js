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
router.post('/create-from-order', validateToken,SaleController.createFromOrder);

module.exports = router;
