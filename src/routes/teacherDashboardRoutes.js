import express from 'express';
import { getTeacherDashboard } from '../controllers/teacherDashboardController.js';

const router = express.Router();

// Example: /api/teacher-dashboard/:teacherId?filter=weekly
router.get('/teacher-dashboard/:teacherId', getTeacherDashboard);

export default router;
