
// routes/topicRoutes.js
import express from 'express';
import multer from 'multer';
import {
    createTopic,
    getTopics,
    updateTopic,
    deleteTopic,
    getTopicsByLessonId
} from '../controllers/topicCourceController.js';
import upload from '../middleware/multer.js';
const topicRouter = express.Router();



// Use multer for topicNotes and practiceQuestionPdf fields
topicRouter.post(
    '/topic',
    upload.fields([
        { name: 'topicNotes', maxCount: 1 },
        { name: 'practiceQuestion', maxCount: 1 }
    ]),
    createTopic
);

topicRouter.get('/topics', getTopics);
topicRouter.patch(
    '/topic/:id',
    upload.fields([
        { name: 'topicNotes', maxCount: 1 },
        { name: 'practiceQuestion', maxCount: 1 }
    ]),
    updateTopic
);
topicRouter.delete('/topic/:id', deleteTopic);
topicRouter.get('/topic/:lessonId', getTopicsByLessonId);

export default topicRouter;