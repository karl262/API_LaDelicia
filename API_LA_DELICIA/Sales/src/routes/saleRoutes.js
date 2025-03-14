/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: The total amount of the sale
 *           example: 500.75
 *         discount:
 *           type: number
 *           description: The discount applied to the sale
 *           example: 50.00
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productid:
 *                 type: integer
 *                 description: ID of the product
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product sold
 *                 example: 3
 */

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: API for managing sales and sale details
 */

/**
 * @swagger
 * /api/sales/get/sales:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales
 *         content:
 *           application/json:
 *             example:
 *               message: Ventas obtenidas correctamente
 *               sales: [{ saleId: 1, total: 500, discount: 50 }]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error al obtener las ventas'
 */

/**
 * @swagger
 * /api/sales/get/sales/by/id/{id}:
 *   get:
 *     summary: Obtener venta por id
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sale ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Sale details found
 *         content:
 *           application/json:
 *             example:
 *               saleId: 1
 *               total: 500
 *               discount: 50
 *               details: [{ productid: 2, quantity: 3 }]
 *       404:
 *         description: Venta no encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: 'Venta no encontrada'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/sales/delete/sale/{id}:
 *   delete:
 *     summary: Eliminar venta por id
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sale ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: 'Venta eliminada exitosamente'
 *       404:
 *         description: Sale not found
 *         content:
 *           application/json:
 *             example:
 *               error: 'Venta no encontrada'
 *       500:
 *         description: Internal server error
 */

import express from "express";
import SaleController from "../controllers/saleController.js";
import { authMiddleware, checkRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/get/sales", authMiddleware, checkRole(['admin']), SaleController.getSales);
router.get("/get/sales/by/id/:id", authMiddleware, checkRole(['admin', 'user']), SaleController.getSaleById);
router.delete("/delete/sale/:id", authMiddleware, checkRole(['admin']), SaleController.deleteSale);
router.post("/create-from-order", authMiddleware,  checkRole(['user', 'admin']), SaleController.createSaleFromOrder);
router.get("/get/sales/by/client/:clientId",authMiddleware, checkRole(['user', 'admin']), SaleController.getSalesByClientId);

export default router;
