import express from 'express';
import authMiddleware  from '../middlewares/auth.js';
import OrderController from '../controllers/orderController.js';

const router = express.Router();
    
router.post('/convert-to-sale/:orderId', authMiddleware, OrderController.convertOrderToSale);
router.post('/create/order', authMiddleware, OrderController.createOrder);
router.get('/get/orders/by/id/:id', authMiddleware, OrderController.getOrderById);
router.patch('/updateStatus/:orderId', OrderController.updateOrderStatus);

export default router;