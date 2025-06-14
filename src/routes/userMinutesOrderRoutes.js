import express from 'express';
import {
    createUserMinutesOrder,
    getAllUserMinutesOrders,
    getUserMinutesOrdersByUserId,
    updateUserMinutesOrder,
    deleteUserMinutesOrder
} from '../controllers/userMinutesOrderController.js';

const router = express.Router();

router.post('/', createUserMinutesOrder);                   // Create order
router.get('/', getAllUserMinutesOrders);                   // Get all orders
router.get('/user/:userId', getUserMinutesOrdersByUserId);       // Get by user ID
router.patch('/:id', updateUserMinutesOrder);               // Update
router.delete('/:id', deleteUserMinutesOrder);              // Delete

export default router;
