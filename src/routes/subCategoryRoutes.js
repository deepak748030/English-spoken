import express from 'express';
import {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} from '../controllers/subCategoryController.js';

const router = express.Router();

router.post('/subcategories', createSubCategory);
router.get('/subcategories', getAllSubCategories);
router.get('/subcategories/:id', getSubCategoryById);
router.patch('/subcategories/:id', updateSubCategory);
router.delete('/subcategories/:id', deleteSubCategory);

export default router;
