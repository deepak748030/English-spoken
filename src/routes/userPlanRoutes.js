import express from 'express';
import { createUserPlan, deductUserClass, getTotalClasses } from '../controllers/userPlanController.js';

const router = express.Router();

router.post('/create-user-plan', createUserPlan);

router.post('/deduct-user-class', deductUserClass)

router.get('/get-user-classes/:userId', getTotalClasses)
export default router;