import express from 'express';
import {
    createUserClasses,
    getAllUserClasses,
    getUserClassesByUserId,
    updateUserClasses,
    deleteUserClasses
} from '../controllers/userClassesController.js';

const router = express.Router();

router.post('/', createUserClasses);
router.get('/', getAllUserClasses);
router.get('/user/:userId', getUserClassesByUserId);
router.patch('/:id', updateUserClasses);
router.delete('/:id', deleteUserClasses);

export default router;
