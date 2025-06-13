import Room from '../models/roomModel.js';
import { sendResponse } from '../utils/response.js'; // optional: if you're using custom response helpers

// ✅ Create a new room
export const createRoom = async (req, res) => {
    try {
        const { createdBy, title, roomType, limit } = req.body;

        const newRoom = new Room({
            createdBy,
            title,
            roomType,
            limit: limit || 10
        });

        await newRoom.save();
        res.status(201).json({ message: 'Room created successfully', data: newRoom });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get all rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('createdBy', 'name mobileNo')
            .populate('users', 'name mobileNo');

        res.status(200).json({ data: rooms });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Join a room
export const joinRoom = async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.users.includes(userId)) {
            return res.status(400).json({ message: 'User already joined the room' });
        }

        if (room.users.length >= room.limit) {
            return res.status(403).json({ message: 'Room user limit reached' });
        }

        room.users.push(userId);
        await room.save();

        res.status(200).json({ message: 'User joined the room', data: room });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ User leaves room
export const leaveRoom = async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const index = room.users.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: 'User not in room' });
        }

        room.users.splice(index, 1); // remove user
        await room.save();

        res.status(200).json({ message: 'User left the room', data: room });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });

        res.status(200).json({ message: 'Room updated', data: updatedRoom });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete room
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) return res.status(404).json({ message: 'Room not found' });

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
