import express from 'express';
import {
    createUserMinutes,
    getAllUserMinutes,
    getUserMinutesByUserId,
    updateUserMinutes,
    deleteUserMinutes
} from '../controllers/userMinutesController.js';

const router = express.Router();

router.post('/', createUserMinutes);
router.get('/', getAllUserMinutes);
router.get('/user/:userId', getUserMinutesByUserId);
router.patch('/:id', updateUserMinutes);
router.delete('/:id', deleteUserMinutes);

export default router;
