// routes/courseSubscriptionRoutes.js
import express from 'express';
import {
    createSubscription,
    getAllSubscriptions,
    updateSubscription,
    deleteSubscription,
    getSubscriptionsByUserId
} from '../controllers/courseSubscriptionController.js';

const router = express.Router();

router.post('/', createSubscription);
router.get('/', getAllSubscriptions);
router.get('/user/:userId', getSubscriptionsByUserId);
router.patch('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

export default router;
