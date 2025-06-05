import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByTeacherId,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
} from '../controllers/teacherCourseOrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/teacher/:teacherId', getOrdersByTeacherId);
router.get('/user/:userId', getOrdersByUserId);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
