import express from 'express';
import ProductController from '../controllers/productsController.js';
import authMiddleware from '../middlewares/auth.js';  

export const router = express.Router();

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
