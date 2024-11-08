const express = require('express');
const ProductController = require('../controllers/productsController');
const AuthMiddleware = require('../middlewares/auth');
const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.get('/get/products', ProductController.getAllProducts);
router.get('/get/products/by/id/:id', ProductController.getProductById);
router.get('/get/products/by/name/:name', ProductController.getProductsByName);
router.get('/get/products/by/price/:price', ProductController.getProductsByPrice);
router.get('/get/products/by/stock/:stock', ProductController.getProductsByStock);
router.get('/get/products/by/sku/:sku', ProductController.getProductsBySku);
router.post('/create/product', ProductController.createProduct);
router.put('/update/product/:id', ProductController.updateProduct);
router.delete('/delete/product/:id', ProductController.deleteProduct);

module.exports = router;
