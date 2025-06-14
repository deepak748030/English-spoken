import express from 'express';
import { resetDailyMinutes } from '../controllers/cronController.js';

const router = express.Router();

router.post('/reset-daily-minutes', resetDailyMinutes); // Call daily via cron

export default router;
