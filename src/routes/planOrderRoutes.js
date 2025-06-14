import express from 'express';
import {
    createPlanOrder,
    updatePlanOrder,
    deletePlanOrder,
    getAllPlanOrders,
    getPlanOrdersByUserId
} from '../controllers/planOrderController.js';

const router = express.Router();

// Create a new purchase
router.post('/', createPlanOrder);

// Update a purchase (PATCH)
router.patch('/:id', updatePlanOrder);

// Delete a purchase
router.delete('/:id', deletePlanOrder);

// Get all purchases
router.get('/', getAllPlanOrders);

// Get purchases by user ID
router.get('/user/:userId', getPlanOrdersByUserId);

export default router;
