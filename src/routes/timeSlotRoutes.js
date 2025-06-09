import express from 'express';
import {
    createTimeSlots,
    getTimeSlotsByTeacherId,
    getTimeSlotsByDate,
    getTimeSlotsByUserId,
    bookTimeSlot,
    getAllTeachersWithFreeSlots,
    deleteTimeSlotById,
    getAllBookedTeacherSlots,
    getBookedSlotsByTeacherId,
    updateTimeSlots,
    getTimeSlotsByTeacherAndType,
    updateSingleTimeSlotById
} from '../controllers/timeSlotController.js';

const router = express.Router();

// ✅ Create time slots
router.post('/', createTimeSlots);

// ✅ Book a time slot
router.patch('/book', bookTimeSlot);

// ✅ Get all time slots by teacher ID
router.get('/teacher/:teacherId', getTimeSlotsByTeacherId);

// ✅ Get all time slots by date
router.get('/date/:date', getTimeSlotsByDate);

// ✅ Get all booked time slots by user ID
router.get('/user/:userId', getTimeSlotsByUserId);

router.delete('/:id', deleteTimeSlotById);

router.get('/teachers/free-slots', getAllTeachersWithFreeSlots);

router.get('/teachers/booked', getAllBookedTeacherSlots);

router.get('/teacher/:teacherId/booked', getBookedSlotsByTeacherId);

router.patch('/:id', updateTimeSlots);

router.get('/teacher/:teacherId/type/:type', getTimeSlotsByTeacherAndType);

router.patch('/update-slot/:id', updateSingleTimeSlotById)


export default router;
