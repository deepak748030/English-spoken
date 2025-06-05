import express from 'express';
import {
    createPremiumOrder,
    getAllPremiumOrders,
    getPremiumOrdersByUserId,
    updatePremiumOrder,
    deletePremiumOrder
} from '../controllers/premiumOrderController.js';

const router = express.Router();

router.post('/', createPremiumOrder);
router.get('/', getAllPremiumOrders);
router.get('/user/:userId', getPremiumOrdersByUserId);
router.patch('/:id', updatePremiumOrder);
router.delete('/:id', deletePremiumOrder);

export default router;
