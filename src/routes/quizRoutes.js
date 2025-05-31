import express from 'express';
import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getDataByType
} from '../controllers/quizController.js';

const router = express.Router();

router.post('/quizzes', createQuiz);
router.get('/quizzes', getAllQuizzes);
router.get('/quizzes/:id', getQuizById);
router.get('/quizzes/type/:type', getDataByType);
router.patch('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

export default router;
