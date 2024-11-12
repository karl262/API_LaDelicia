import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import OrderController from '../controllers/orderController.js';

const router = express.Router();
    
router.post( '/convert-to-sale/:orderId', authMiddleware, OrderController.convertOrderToSale);

export default router;