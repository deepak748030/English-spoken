import Room from '../models/roomModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import AudioVideoOrder from '../models/AudioVideoOrderModel.js';
import { sendResponse } from '../utils/response.js';

const generateRoomId = async () => {
    const now = new Date();
    const timestamp = now
        .toISOString()
        .replace(/[-:T]/g, '') // Remove delimiters
        .slice(0, 12); // yyyyMMddHHmm → 12-digit format

    const existingRooms = await Room.countDocuments({
        createdAt: {
            $gte: new Date(now.toDateString()) // Count rooms created today
        }
    });

    const counter = (existingRooms + 1).toString().padStart(3, '0');
    return `room-${timestamp}-${counter}`;
};

export const createRoom = async (req, res) => {
    try {
        const { createdBy, title, roomType, limit } = req.body;

        const roomId = await generateRoomId();
        const jitsiUrl = `https://194.238.19.95:8443/${roomId}`;

        const newRoom = new Room({
            createdBy,
            title,
            roomType,
            limit: limit || 10,
            users: [createdBy],
            jitsiUrl
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

        // Step 1: Get user minutes from UserMinutes
        const userMinutes = await UserMinutes.findOne({ userId });

        let remainingAudioMinutes = userMinutes?.lifetimeAudioMinutes || 0;
        let remainingVideoMinutes = userMinutes?.lifetimeVideoMinutes || 0;

        // Step 2: Get all active AudioVideoOrders
        const activeOrders = await AudioVideoOrder.find({
            userId,
            status: 'active',
            expireAt: { $gte: new Date() }
        });

        for (const order of activeOrders) {
            remainingAudioMinutes += order.audioMinutes;
            remainingVideoMinutes += order.videoMinutes;
        }

        // Step 3: Add user to room
        room.users.push(userId);
        await room.save();

        // Step 4: Send response with remaining balances
        sendResponse(res, 200, 'User joined the room', {
            room,
            availableMinutes: room.roomType === 'audio'
                ? remainingAudioMinutes
                : room.roomType === 'video'
                    ? remainingVideoMinutes
                    : 0,
            remainingAudioMinutes,
            remainingVideoMinutes
        });

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

// ✅ User leaves roomexport 

export const leaveRoom = async (req, res) => {
    try {
        const { roomId, userId, minutes } = req.body;

        if (!roomId || !userId || !minutes) {
            return sendResponse(res, 400, 'Missing required fields');
        }

        const room = await Room.findById(roomId);
        if (!room) return sendResponse(res, 404, 'Room not found');

        const roomType = room.roomType;
        if (!['audio', 'video'].includes(roomType)) {
            return sendResponse(res, 400, 'Invalid room type');
        }

        const userIndex = room.users.indexOf(userId);
        if (userIndex === -1) return sendResponse(res, 400, 'User not in room');

        // Step 1: Deduct from active orders
        const now = new Date();
        const orders = await AudioVideoOrder.find({
            userId,
            status: 'active',
            expireAt: { $gte: now }
        }).sort({ expireAt: 1 });

        let remainingMinutes = minutes;

        for (const order of orders) {
            let available = roomType === 'audio' ? order.audioMinutes : order.videoMinutes;
            if (available <= 0) continue;

            const deduct = Math.min(available, remainingMinutes);
            remainingMinutes -= deduct;

            if (roomType === 'audio') {
                order.audioMinutes -= deduct;
            } else {
                order.videoMinutes -= deduct;
            }

            await order.save();

            if (remainingMinutes <= 0) break;
        }

        // Step 2: Deduct from lifetime
        const userMinutes = await UserMinutes.findOne({ userId });
        if (!userMinutes) return sendResponse(res, 404, 'UserMinutes not found');

        if (remainingMinutes > 0) {
            const available = roomType === 'audio'
                ? userMinutes.lifetimeAudioMinutes
                : userMinutes.lifetimeVideoMinutes;

            if (available >= remainingMinutes) {
                if (roomType === 'audio') {
                    userMinutes.lifetimeAudioMinutes -= remainingMinutes;
                } else {
                    userMinutes.lifetimeVideoMinutes -= remainingMinutes;
                }

                remainingMinutes = 0;
            }
        }

        if (remainingMinutes > 0) {
            return sendResponse(res, 402, 'Insufficient balance');
        }

        // Step 3: Update daily minutes
        if (roomType === 'audio') {
            userMinutes.dailyAudioMinutes = Math.max(userMinutes.dailyAudioMinutes - minutes, 0);
        } else {
            userMinutes.dailyVideoMinutes = Math.max(userMinutes.dailyVideoMinutes - minutes, 0);
        }

        await userMinutes.save();

        // Step 4: Remove user from room
        room.users.splice(userIndex, 1);

        if (room.users.length === 0) {
            await room.deleteOne(); // ✅ delete the room if empty
            console.log('room deleted')
        } else {
            await room.save(); // ✅ else save updated users list
        }

        // Step 5: Calculate remaining total minutes
        const updatedOrders = await AudioVideoOrder.find({
            userId,
            status: 'active',
            expireAt: { $gte: new Date() }
        });

        let remainingAudioMinutes = updatedOrders.reduce((sum, o) => sum + (o.audioMinutes || 0), 0);
        let remainingVideoMinutes = updatedOrders.reduce((sum, o) => sum + (o.videoMinutes || 0), 0);

        remainingAudioMinutes += userMinutes.lifetimeAudioMinutes;
        remainingVideoMinutes += userMinutes.lifetimeVideoMinutes;

        return sendResponse(res, 200, 'User left the room and minutes deducted', {
            room,
            remainingToDeduct: 0,
            updatedUserMinutes: {
                dailyAudioMinutes: userMinutes.dailyAudioMinutes,
                dailyVideoMinutes: userMinutes.dailyVideoMinutes,
                lifetimeAudioMinutes: userMinutes.lifetimeAudioMinutes,
                lifetimeVideoMinutes: userMinutes.lifetimeVideoMinutes
            },
            remainingAudioMinutes,
            remainingVideoMinutes
        });

    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
