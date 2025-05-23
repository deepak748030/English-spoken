
// routes/lessonRoutes.js
import express from 'express';
import {
    createLesson,
    getLessons,
    updateLesson,
    deleteLesson,
    getLessonByCourseId
} from '../controllers/lessonCourseController.js';

const lessonRouter = express.Router();

lessonRouter.post('/lesson', createLesson);
lessonRouter.get('/lessons', getLessons);
lessonRouter.patch('/lesson/:id', updateLesson);
lessonRouter.delete('/lesson/:id', deleteLesson);
lessonRouter.get('/lesson/:courseId', getLessonByCourseId);

export default lessonRouter;