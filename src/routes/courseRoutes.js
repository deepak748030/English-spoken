import express from 'express';
import {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getCoursesByType,
    getCourseByTeacherId
} from '../controllers/courseController.js';

const router = express.Router();

router.post('/course', createCourse);
router.get('/courses', getCourses);
router.get('/course/teacher/:teacherId', getCourseByTeacherId);
router.get('/course/type/:type', getCoursesByType)
router.patch('/course/:id', updateCourse);
router.delete('/course/:id', deleteCourse);

export default router;