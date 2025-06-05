import express from 'express';
import upload from '../middleware/multer.js';
import {
    createTeacherCourse,
    getTeacherCourses,
    updateTeacherCourse,
    deleteTeacherCourse,
    getCoursesByTeacherId,
    getTeacherCoursesBySubcategoryId
} from '../controllers/teacherCourseController.js';

const router = express.Router();

router.post(
    '/teacher-course',
    upload.fields([
        { name: 'coverImg', maxCount: 1 },
        { name: 'demoPdf', maxCount: 1 },
        { name: 'originalPdf', maxCount: 1 }
    ]),
    createTeacherCourse
);

router.get('/teacher-courses', getTeacherCourses);
router.get('/teacher-courses/:teacherId', getCoursesByTeacherId);

router.patch(
    '/teacher-course/:id',
    upload.fields([
        { name: 'coverImg', maxCount: 1 },
        { name: 'demoPdf', maxCount: 1 },
        { name: 'originalPdf', maxCount: 1 }
    ]),
    updateTeacherCourse
);
router.get('/teacher-courses/subcategory/:subcategoryId', getTeacherCoursesBySubcategoryId);
router.delete('/teacher-course/:id', deleteTeacherCourse);

export default router;
