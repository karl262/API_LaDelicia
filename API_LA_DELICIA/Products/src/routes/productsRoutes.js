import express from 'express';
import ProductController from '../controllers/productsController.js';
import authMiddleware from '../middlewares/auth.js';  

export const router = express.Router();

router.use(authMiddleware);

router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.get('/products/name/:name', ProductController.getProductsByName);
router.get('/products/price/:price', ProductController.getProductsByPrice);
router.get('/products/stock/:stock', ProductController.getProductsByStock);
router.get('/products/sku/:sku', ProductController.getProductsBySku);
router.post('/products', ProductController.createProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

export default router;
