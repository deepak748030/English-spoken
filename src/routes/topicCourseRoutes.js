
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

const topicRouter = express.Router();

// Multer storage configuration for PDFs
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/pdfs/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

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