import express from 'express';
import {
    createRoom,
    getAllRooms,
    joinRoom,
    updateRoom,
    deleteRoom,
    leaveRoom
} from '../controllers/roomController.js';

const router = express.Router();

// Create new room
router.post('/', createRoom);

// Get all rooms
router.get('/', getAllRooms);

// Join a room
router.post('/join', joinRoom);

// Update room using PATCH
router.patch('/:id', updateRoom);

// Delete a room
router.delete('/:id', deleteRoom);

router.post('/leave', leaveRoom); // ✅ newly added

export default router;
