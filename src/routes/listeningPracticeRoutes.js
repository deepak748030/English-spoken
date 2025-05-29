import express from 'express';
import {
    createListeningPractice,
    getAllListeningPractices,
    getListeningPracticeBySubCategory,
    updateListeningPractice,
    deleteListeningPractice
} from '../controllers/listeningPracticeController.js';

const router = express.Router();

router.post('/listening-practice', createListeningPractice);
router.get('/listening-practice', getAllListeningPractices);
router.get('/listening-practice/subcategory/:subCategoryId', getListeningPracticeBySubCategory);
router.patch('/listening-practice/:id', updateListeningPractice);
router.delete('/listening-practice/:id', deleteListeningPractice);

export default router;
