import express from 'express';
import {
    createLiveClass,
    getAllLiveClasses,
    getLiveClassesByTeacher,
    updateLiveClass,
    deleteLiveClass
} from '../controllers/teacherLiveClassController.js';

const router = express.Router();

router.post('/', createLiveClass); // Create
router.get('/', getAllLiveClasses); // Get all
router.get('/teacher/:teacherId', getLiveClassesByTeacher); // Get by teacher
router.patch('/:id', updateLiveClass); // Update
router.delete('/:id', deleteLiveClass); // Delete

export default router;
