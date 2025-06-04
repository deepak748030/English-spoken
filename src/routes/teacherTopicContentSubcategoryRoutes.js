import express from 'express';
import {
    createSubcategory,
    getAllSubcategories,
    getByTypeAndOptionalTypeId,
    updateSubcategory,
    deleteSubcategory
} from '../controllers/teacherTopicContentSubcategoryController.js';

const router = express.Router();

router.post('/', createSubcategory);
router.get('/', getAllSubcategories);
router.get('/filter', getByTypeAndOptionalTypeId);
router.patch('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

export default router;
