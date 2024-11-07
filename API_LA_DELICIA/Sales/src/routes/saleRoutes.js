const express = require('express');
const SaleController = require('../controllers/saleController');
const AuthMiddleware = require('../middlewares/auth')

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.post('/sales', SaleController.createSale);
router.get('/sales', SaleController.getSales);
router.get('/sales/:id', SaleController.getSaleById);
router.put('/sales/:id', SaleController.updateSale);
router.delete('/sales/:id', SaleController.deleteSale);
router.post('/sales/create-from-order', validateToken,SaleController.createFromOrder);

module.exports = router;
