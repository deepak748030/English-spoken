import express from 'express';
import {
    createOrUpdateUserMinutes,
    getAllUserMinutes,
    getUserMinutesByUserId,
    updateUserMinutes,
    deleteUserMinutes
} from '../controllers/userMinutesController.js';

const router = express.Router();

router.post('/', createOrUpdateUserMinutes); // create or update
router.get('/', getAllUserMinutes); // get all
router.get('/:userId', getUserMinutesByUserId); // get by userId
router.patch('/:id', updateUserMinutes); // update by MongoDB id
router.delete('/:id', deleteUserMinutes); // delete by MongoDB id

export default router;
