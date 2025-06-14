import Room from '../models/roomModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import AudioVideoOrder from '../models/AudioVideoOrderModel.js';
import { sendResponse } from '../utils/response.js';

// ✅ Create a new room
export const createRoom = async (req, res) => {
    try {
        const { createdBy, title, roomType, limit } = req.body;

        const newRoom = new Room({
            createdBy,
            title,
            roomType,
            limit: limit || 10,
            users: [createdBy]
        });

        await newRoom.save();
        sendResponse(res, 201, 'Room created successfully', newRoom);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ Get all rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('createdBy', 'name mobileNo')
            .populate('users', 'name mobileNo');

        sendResponse(res, 200, 'Fetched all rooms', rooms);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ Join a room

export const joinRoom = async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return sendResponse(res, 404, 'Room not found');

        if (room.users.includes(userId)) {
            return sendResponse(res, 400, 'User already joined the room');
        }

        if (room.users.length >= room.limit) {
            return sendResponse(res, 403, 'Room user limit reached');
        }

        // Step 1: Get minutes from UserMinutes model
        const userMinutes = await UserMinutes.findOne({ userId });

        let availableAudioMinutes = 0;
        let availableVideoMinutes = 0;

        if (userMinutes) {
            availableAudioMinutes += userMinutes.lifetimeAudioMinutes;
            availableVideoMinutes += userMinutes.lifetimeVideoMinutes;
        }

        // Step 2: Get active AudioVideoOrder and add minutes
        const activeOrder = await AudioVideoOrder.findOne({
            userId,
            status: 'active',
            expireAt: { $gt: new Date() }
        });

        if (activeOrder) {
            availableAudioMinutes += activeOrder.audioMinutes;
            availableVideoMinutes += activeOrder.videoMinutes;
        }

        // Step 3: Based on roomType, only return the relevant minutes
        const responseData = {
            room,
            availableMinutes: room.roomType === 'audio'
                ? availableAudioMinutes
                : room.roomType === 'video'
                    ? availableVideoMinutes
                    : 0
        };

        // Step 4: Add user to room
        room.users.push(userId);
        await room.save();

        sendResponse(res, 200, 'User joined the room', responseData);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ User leaves room
export const leaveRoom = async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return sendResponse(res, 404, 'Room not found');

        const index = room.users.indexOf(userId);
        if (index === -1) {
            return sendResponse(res, 400, 'User not in room');
        }

        room.users.splice(index, 1);
        await room.save();

        sendResponse(res, 200, 'User left the room', room);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ Update room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedRoom) return sendResponse(res, 404, 'Room not found');

        sendResponse(res, 200, 'Room updated', updatedRoom);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ Delete room
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) return sendResponse(res, 404, 'Room not found');

        sendResponse(res, 200, 'Room deleted successfully');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
