/**
 * @swagger
 * api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     description: Obtiene todos los productos
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Productos obtenidos con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por su id
 *     description: Obtiene un producto por su id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * api/products/name/{name}:
 *   get:
 *     summary: Obtiene productos por su nombre
 *     description: Obtiene productos por su nombre
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Productos no encontrados
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /api/products/price/{price}:
 *   get:
 *     summary: Obtiene productos por su precio
 *     description: Obtiene productos por su precio
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: price
 *         schema:
 *           type: number
 *         required: true
 *         description: Precio del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Productos no encontrados
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /api/products/stock/{stock}:
 *   get:
 *     summary: Obtiene productos por su stock
 *     description: Obtiene productos por su stock
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: stock
 *         schema:
 *           type: number
 *         required: true
 *         description: Stock del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Productos no encontrados
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /api/products/sku/{sku}:
 *   get:
 *     summary: Obtiene productos por su sku
 *     description: Obtiene productos por su sku
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: sku
 *         schema:
 *           type: string
 *         required: true
 *         description: SKU del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Productos no encontrados
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un producto
 *     description: Crea un producto
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto por su id
 *     description: Actualiza un producto por su id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto por su id
 *     description: Elimina un producto por su id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado con exito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado con exito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name_product
 *         - price_product
 *         - stock
 *         - ingredients
 *         - baking_time
 *       properties:
 *         id:
 *           type: string
 *           description: ID del producto
 *         name_product:
 *           type: string
 *           description: Nombre del producto
 *         price_product:
 *           type: number
 *           description: Precio del producto
 *         stock:
 *           type: number
 *           description: Stock del producto
 *         ingredients:
 *           type: string
 *           description: Ingredientes del producto
 *         baking_time:
 *           type: string
 *           description: Tiempo de horneado del producto
 *       example:
 *         id: 1
 *         name_product: Pan Integral
 *         price_product: 25.99
 *         stock: 50
 *         ingredients: Harina integral, Agua, Sal
 *         baking_time: 40 minutos
 */

import express from 'express';
import ProductController from '../controllers/productsController.js';
import authMiddleware from '../middlewares/auth.js';  

const router = express.Router();

router.use(authMiddleware);

router.get('/get/products', ProductController.getAllProducts);
router.get('/get/products/by/id/:id', ProductController.getProductById);
router.get('/get/products/by/name/:name', ProductController.getProductsByName);
router.get('/get/products/by/price/:price', ProductController.getProductsByPrice);
router.get('/get/products/by/stock/:stock', ProductController.getProductsByStock);
router.get('/get/products/by/sku/:sku', ProductController.getProductsBySku);
router.post('/create/product', ProductController.createProduct);
router.put('/update/product/:id', ProductController.updateProduct);
router.delete('/delete/product/:id', ProductController.deleteProduct);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'product-service' });
});

export default router;