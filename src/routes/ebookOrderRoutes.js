import express from 'express';
import {
    createEbookOrder,
    getAllEbookOrders,
    getEbookOrdersByUserId,
    updateEbookOrder,
    deleteEbookOrder,
} from '../controllers/ebookOrderController.js';

const router = express.Router();

// Create order
router.post('/', createEbookOrder);

// Get all orders
router.get('/', getAllEbookOrders);

// Get orders by user ID
router.get('/user/:userId', getEbookOrdersByUserId);

// Update order by ID
router.patch('/:id', updateEbookOrder);

// Delete order by ID
router.delete('/:id', deleteEbookOrder);

export default router;
