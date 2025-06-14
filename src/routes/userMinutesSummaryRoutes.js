import express from 'express';
import { getUserMinutesSummaryByUserId } from '../controllers/userMinutesSummaryController.js';

const router = express.Router();

// ✅ GET /api/user-minutes-summary/:userId
router.get('/:userId', getUserMinutesSummaryByUserId);

export default router;
