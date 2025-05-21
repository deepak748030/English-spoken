import express from 'express';
import {
    createTopicContent,
    getAllTopicContents,
    getTopicContentById,
    updateTopicContent,
    deleteTopicContent
} from '../controllers/topicContentController.js';

const router = express.Router();

router.post('/topic-contents', createTopicContent);
router.get('/topic-contents', getAllTopicContents);
router.get('/topic-contents/:id', getTopicContentById);
router.patch('/topic-contents/:id', updateTopicContent);
router.delete('/topic-contents/:id', deleteTopicContent);

export default router;
