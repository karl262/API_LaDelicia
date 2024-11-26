/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: API para manejar pedidos
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/orders/convert-to-sale/{orderId}:
 *   post:
 *     summary: Convertir un pedido en venta
 *     description: Convierte un pedido existente en una venta y actualiza su estado.
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
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
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: No autorizado
 *
 * /api/orders/create/order:
 *   post:
 *     summary: Crear un pedido
 *     description: Crea un nuevo pedido.
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientid:
 *                 type: integer
 *                 description: ID del cliente
 *               total:
 *                 type: number
 *                 description: Total del pedido
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productsid:
 *                       type: integer
 *                       description: ID del producto
 *                     quantity:
 *                       type: integer
 *                       description: Cantidad del producto
 *                     price_at_order:
 *                       type: number
 *                       description: Precio del producto al momento de la orden
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Pedido no creado, faltan campos obligatorios
 *       401:
 *         description: No autorizado
 *
 * /api/orders/get/orders/by/id/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     description: Obtiene un pedido por su ID.
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido a obtener
 *     responses:
 *       200:
 *         description: Pedido obtenido exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: No autorizado
 *
 * /api/orders/updateStatus/{orderId}:
 *   patch:
 *     summary: Actualizar estado de un pedido
 *     description: Actualiza el estado de un pedido existente.
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nuevo estado del pedido
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       400:
 *         description: Pedido no actualizado, faltan campos obligatorios
 *       401:
 *         description: No autorizado
 */


import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import OrderController from '../controllers/orderController.js';

const router = express.Router();

router.post('/convert-to-sale/:orderId', authMiddleware, OrderController.convertOrderToSale);
router.post('/create/order', authMiddleware, OrderController.createOrder);
router.get('/get/orders/by/id/:id', authMiddleware, OrderController.getOrderById);
router.patch('/updateStatus/:orderId',authMiddleware, OrderController.updateOrderStatus);
router.post('/convert-to-sale/:orderId', authMiddleware, OrderController.convertOrderToSale);
router.patch('/add/discount/:orderId', authMiddleware, OrderController.addOrderDiscount);

export default router;

