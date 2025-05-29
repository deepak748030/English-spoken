import express from 'express';
import {
    createDailyUseSentence,
    getDailyUseSentences,
    deleteDailyUseSentence,
    updateDailyUseSentence,
    getDailyUseSentencesBySubcategoryId
} from '../controllers/dailyUseSentenceController.js';

const router = express.Router();

router.post('/sentence', createDailyUseSentence);
router.get('/sentences', getDailyUseSentences);
router.get('/sentence/subcategory/:subcategoryId', getDailyUseSentencesBySubcategoryId);
router.delete('/sentence/:id', deleteDailyUseSentence);
router.patch('/sentence/:id', updateDailyUseSentence);

export default router;
