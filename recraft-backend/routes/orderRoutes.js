import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

// To create a new order, you must be logged in
router.route('/').post(protect, addOrderItems);

// To get your own orders, you must be logged in
router.route('/myorders').get(protect, getMyOrders);

export default router;