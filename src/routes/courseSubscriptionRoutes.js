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

router.post('/subscription', createSubscription);
router.get('/subscriptions', getAllSubscriptions);
router.get('/subscriptions/user/:userId', getSubscriptionsByUserId);
router.patch('/subscription/:id', updateSubscription);
router.delete('/subscription/:id', deleteSubscription);

export default router;
