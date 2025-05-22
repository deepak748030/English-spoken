import express from 'express';
import {
    createPracticeGame,
    getAllPracticeGames,
    getPracticeGameById,
    updatePracticeGame,
    deletePracticeGame
} from '../controllers/practiceGameController.js';

const router = express.Router();

router.post('/practice-games', createPracticeGame);
router.get('/practice-games', getAllPracticeGames);
router.get('/practice-games/:id', getPracticeGameById);
router.patch('/practice-games/:id', updatePracticeGame);
router.delete('/practice-games/:id', deletePracticeGame);

export default router;
