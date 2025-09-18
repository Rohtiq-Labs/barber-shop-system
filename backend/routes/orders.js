import express from 'express';
const router = express.Router();
import OrderController from '../controllers/orderController.js';

// Public routes (for customers)
router.post('/', OrderController.createOrder);
router.get('/lookup/:orderNumber', OrderController.getOrderByNumber);
router.post('/customer-lookup', OrderController.getCustomerOrders);

// Admin routes (for admin panel - add authentication middleware later)
router.get('/', OrderController.getAllOrders);
router.get('/stats', OrderController.getOrderStats);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);
router.get('/:id/items', OrderController.getOrderItems);
router.put('/:id/status', OrderController.updateOrderStatus);

// Order items routes
router.post('/:id/items', OrderController.addOrderItem);
router.put('/items/:id', OrderController.updateOrderItem);
router.delete('/items/:id', OrderController.deleteOrderItem);

export default router;
