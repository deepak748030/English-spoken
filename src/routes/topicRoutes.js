// src/routes/topicRoutes.js
import express from 'express';
import {
    createTopic,
    getAllTopics,
    updateTopic,
    deleteTopic,
    getAllTopicsByType
} from '../controllers/topicController.js';

const router = express.Router();

router.post('/topics', createTopic);
router.get('/topics', getAllTopics);
router.get('/topics/:type', getAllTopicsByType);
router.patch('/topics/:id', updateTopic);
router.delete('/topics/:id', deleteTopic);

export default router;
