const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Ya no se requiere el token aquí
router.post('/orders', OrderController.createOrder);   // Crear un pedido
router.get('/orders', OrderController.getAllOrders);  // Obtener todos los pedidos
router.get('/orders/:id', OrderController.getOrderById); // Obtener un pedido por ID
router.delete('/orders/:id', OrderController.deleteOrder);  // Eliminar un pedido

module.exports = router;
