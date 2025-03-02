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
 *
 * /api/orders/ticket/{id}:
 *   get:
 *     summary: Obtener información de ticket de un pedido
 *     description: Obtiene la información detallada de un pedido para generar un ticket.
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido para obtener información de ticket
 *     responses:
 *       200:
 *         description: Información del ticket obtenida exitosamente
 *       404:
 *         description: Ticket de pedido no encontrado
 *       401:
 *         description: No autorizado
 *
 * /api/orders/ticket/pdf/{id}:
 *   get:
 *     summary: Descargar ticket de pedido en PDF
 *     description: Genera y descarga un ticket de pedido en formato PDF
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido para generar ticket PDF
 *     responses:
 *       200:
 *         description: Ticket PDF generado y descargado exitosamente
 *       404:
 *         description: Ticket de pedido no encontrado
 *       401:
 *         description: No autorizado
 *
 * /api/orders/cancel/{orderId}:
 *   put:
 *     summary: Cancelar un pedido
 *     description: Cancela un pedido existente.
 *     security:
 *       - BearerAuth: []  # Protegido por autenticación
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido a cancelar
 *     responses:
 *       200:
 *         description: Pedido cancelado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: No autorizado
 */

import express from "express";
import { authMiddleware, checkRole } from "../middlewares/auth.js";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/convert-to-sale/:orderId",
  authMiddleware,
  checkRole(["admin"]),
  OrderController.convertOrderToSale
);
router.post("/create/order", authMiddleware, OrderController.createOrder);
router.get(
  "/get/orders/by/id/:id",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.getOrderById
);
router.patch(
  "/updateStatus/:orderId",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.updateOrderStatus
);
router.patch(
  "/add/discount/:orderId",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.addOrderDiscount
);
router.get(
  "/get/orders/by/client/:clientid",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.getOrdersByClient
);
router.get(
  "/ticket/:id",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.getOrderTicket
);
router.get(
  "/ticket/pdf/:id",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.generateOrderTicketPDF
);
router.put(
  "/cancel/:orderId",
  authMiddleware,
  checkRole(["user", "admin"]),
  OrderController.cancelOrder
);

export default router;
