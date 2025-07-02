import express from 'express';
import { createUserPlan, deductUserClass, getTotalClasses, getUserAllPlans, getUserPlans } from '../controllers/userPlanController.js';

const router = express.Router();

router.post('/create-user-plan', createUserPlan);

router.post('/deduct-user-class', deductUserClass)

router.get('/get-user-classes/:userId', getTotalClasses);

router.get('/get-user-userplan/:userId', getUserPlans);

router.get('/get-user-plans', getUserAllPlans);

export default router;