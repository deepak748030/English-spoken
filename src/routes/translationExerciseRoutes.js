import express from 'express';
import {
    createTranslationExercise,
    getTranslationExercises,
    getTranslationExercisesBySubCategory,
    updateTranslationExercise,
    deleteTranslationExercise
} from '../controllers/translationExerciseController.js';

const router = express.Router();

router.post('/translation-exercise', createTranslationExercise);
router.get('/translation-exercises', getTranslationExercises);
router.get('/translation-exercises/subcategory/:subCategoryId', getTranslationExercisesBySubCategory);
router.patch('/translation-exercise/:id', updateTranslationExercise);
router.delete('/translation-exercise/:id', deleteTranslationExercise);

export default router;
