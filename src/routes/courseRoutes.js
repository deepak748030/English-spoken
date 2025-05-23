import express from 'express';
import {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
} from '../controllers/courseController.js';

const router = express.Router();

router.post('/course', createCourse);
router.get('/courses', getCourses);
router.patch('/course/:id', updateCourse);
router.delete('/course/:id', deleteCourse);

export default router;