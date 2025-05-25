// routes/courseSubscriptionRoutes.js
import express from 'express';
import {
    createSubscription,
    getAllSubscriptions,
    updateSubscription,
    deleteSubscription
} from '../controllers/courseSubscriptionController.js';

const router = express.Router();

router.post('/subscription', createSubscription);
router.get('/subscriptions', getAllSubscriptions);
router.patch('/subscription/:id', updateSubscription);
router.delete('/subscription/:id', deleteSubscription);

export default router;
