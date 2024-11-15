import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import OrderController from '../controllers/orderController.js';

const router = express.Router();

/**
 * @swagger
 * /convert-to-sale/{orderId}:
 *   post:
 *     summary: Convertir un pedido en venta
 *     description: Convierte un pedido existente en una venta y actualiza su estado.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido a convertir
 *     responses:
 *       200:
 *         description: Pedido convertido en venta exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: "entregado"
 *                 saleId:
 *                   type: integer
 *                   example: 101
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: No autorizado
 */
router.post('/convert-to-sale/:orderId', authMiddleware, OrderController.convertOrderToSale);

export default router;
