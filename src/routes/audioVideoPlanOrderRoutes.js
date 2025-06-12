// routes/audioVideoOrderRoutes.js
import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
} from '../controllers/audioVideoPlanOrderController.js';

const router = express.Router();

// ✅ Create new order
router.post('/', createOrder);

// ✅ Get all active orders (auto-expire check)
router.get('/', getAllOrders);

// ✅ Get all active orders for a specific user
router.get('/user/:userId', getOrdersByUserId);

// ✅ Update an order by ID
router.patch('/:id', updateOrder);

// ✅ Delete an order by ID
router.delete('/:id', deleteOrder);

export default router;
