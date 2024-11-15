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
 * /create/sale:
 *   post:
 *     summary: Crea una nueva venta
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *           example:
 *             total: 1200.50
 *             discount: 100.00
 *             details:
 *               - productid: 2
 *                 quantity: 5
 *               - productid: 3
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: Venta creada exitosamente
 *               saleId: 45
 *       400:
 *         description: Bad request, missing data
 *         content:
 *           application/json:
 *             example:
 *               error: 'Todos los campos son obligatorios'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error al crear la venta'
 */

/**
 * @swagger
 * /get/sales:
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
 * /get/sales/by/id/{id}:
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
 * /update/sale/{id}:
 *   put:
 *     summary: Actualizar venta por id
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *           example:
 *             total: 950.00
 *             discount: 50.00
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: 'Venta actualizada exitosamente'
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
 * /delete/sale/{id}:
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

import express from 'express';
import SaleController from '../controllers/saleController.js';
import authMiddleware from '../middlewares/auth.js'

const router = express.Router();

router.use(authMiddleware);

router.post('/create/sale', SaleController.createSale);
router.get('/get/sales', SaleController.getSales);
router.get('/get/sales/by/id/:id', SaleController.getSaleById);
router.put('/update/sale/:id', SaleController.updateSale);
router.delete('/delete/sale/:id', SaleController.deleteSale);
router.post('/create-from-order', SaleController.createSaleFromOrder);

export default router;