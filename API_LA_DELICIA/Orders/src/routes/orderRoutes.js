const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authMiddleware');
const OrderController = require('../controllers/orderController');

router.post( '/convert-to-sale/:orderId', validateToken,OrderController.convertOrderToSale);

module.exports = router;