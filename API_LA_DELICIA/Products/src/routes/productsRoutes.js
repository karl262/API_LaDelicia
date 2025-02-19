/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name_product
 *         - price_product
 *         - categoryid
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
 *         categoryid:
 *           type: string
 *           description: ID de la categoría del producto
 *         stock:
 *           type: number
 *           description: Stock del producto
 *         ingredients:
 *           type: string
 *           description: Ingredientes del producto
 *         baking_time:
 *           type: string
 *           description: Tiempo de horneado del producto
 *         image:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen del producto
 *       example:
 *         id: "1"
 *         name_product: "Pan Integral"
 *         price_product: 25.99
 *         categoryid: "1"
 *         stock: 50
 *         ingredients: "Harina integral, Agua, Sal"
 *         baking_time: "40 minutos"
 *         image: "file-to-upload.jpg"
 *
 * tags:
 *   - name: Products
 *     description: Endpoints para la gestión de productos
 */

/**
 * @swagger
 * /api/products/get/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     description: Recupera todos los productos que no están eliminados
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/get/products/by/id/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     description: Recupera un producto específico basado en su ID
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/create/product:
 *   post:
 *     summary: Crea un nuevo producto
 *     description: Añade un nuevo producto a la base de datos
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name_product:
 *                 type: string
 *                 description: Nombre del producto
 *               price_product:
 *                 type: number
 *                 description: Precio del producto
 *               categoryid:
 *                 type: string
 *                 description: ID de la categoría
 *               stock:
 *                 type: number
 *                 description: Stock del producto
 *               ingredients:
 *                 type: string
 *                 description: Ingredientes del producto
 *               baking_time:
 *                 type: string
 *                 description: Tiempo de horneado
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (archivo)
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/update/product/{id}:
 *   put:
 *     summary: Actualiza un producto
 *     description: Modifica los detalles de un producto existente
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name_product:
 *                 type: string
 *                 description: Nombre del producto
 *               price_product:
 *                 type: number
 *                 description: Precio del producto
 *               categoryid:
 *                 type: string
 *                 description: ID de la categoría
 *               stock:
 *                 type: number
 *                 description: Stock del producto
 *               ingredients:
 *                 type: string
 *                 description: Ingredientes del producto
 *               baking_time:
 *                 type: string
 *                 description: Tiempo de horneado
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (archivo)
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/delete/product/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     description: Marca un producto como eliminado
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/get/products/by/name_product/{name_product}:
 *   get:
 *     summary: Obtiene productos por nombre
 *     description: Recupera productos basados en su nombre
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name_product
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/get/products/by/price_product/{price_product}:
 *   get:
 *     summary: Obtiene productos por precio
 *     description: Recupera productos basados en su precio
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: price_product
 *         required: true
 *         schema:
 *           type: number
 *         description: Precio del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/get/products/by/stock/{stock}:
 *   get:
 *     summary: Obtiene productos por stock
 *     description: Recupera productos basados en la cantidad de stock
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stock
 *         required: true
 *         schema:
 *           type: number
 *         description: Stock del producto
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

import express from "express";
import ProductController from "../controllers/productsController.js";
import { authMiddleware, checkRole } from "../middlewares/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/get/products", authMiddleware, checkRole(['user', 'admin']), ProductController.getAllProducts);
router.get("/get/products/by/id/:id", authMiddleware, checkRole(['user', 'admin']), ProductController.getProductById);
router.get(
  "/get/products/by/name_product/:name_product",
  authMiddleware,
  checkRole(['user', 'admin']),
  ProductController.getProductsByName
);
router.get(
  "/get/products/by/price_product/:price_product",
  authMiddleware,
  checkRole(['user', 'admin']),
  ProductController.getProductsByPrice
);
router.get(
  "/get/products/by/stock/:stock",
  authMiddleware,
  checkRole(['user', 'admin']),
  ProductController.getProductsByStock
);
router.post(
  "/create/product",
  authMiddleware, checkRole(['admin']),
  upload.single("image"),
  ProductController.createProduct
);
router.put(
  "/update/product/:id",
  upload.single("image"),
  authMiddleware, checkRole(['admin']),
  ProductController.updateProduct
);
router.delete("/delete/product/:id", authMiddleware, checkRole(['admin']), ProductController.deleteProduct);

router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "product-service" });
});

export default router;
