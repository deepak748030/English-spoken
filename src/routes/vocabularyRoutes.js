import express from 'express';
import { createVocabulary, deleteVocabulary, getAllVocabulary, getDataByType, getVocabularyById, updateVocabulary } from '../controllers/vocabularyController.js';

const router = express.Router();

router.post('/vocabulary', createVocabulary);
router.get('/vocabularies', getAllVocabulary);
router.get('/vocabulary/:id', getVocabularyById);
router.get('/vocabulary/type/:type', getDataByType); // Assuming this is to get vocabularies by type
router.patch('/vocabulary/:id', updateVocabulary);
router.delete('/vocabulary/:id', deleteVocabulary);

export default router;
