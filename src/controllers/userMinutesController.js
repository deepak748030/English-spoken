import UserMinutes from '../models/usersMinutesModel.js';
import { sendResponse } from '../utils/response.js';

// Create
export const createUserMinutes = async (req, res) => {
    try {
        const userMinutes = await UserMinutes.create(req.body);
        sendResponse(res, 201, 'User minutes created', userMinutes);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Get All (simple)
export const getAllUserMinutes = async (req, res) => {
    try {
        const allMinutes = await UserMinutes.find().populate("userId", "mobileNo");
        sendResponse(res, 200, 'All user minutes fetched', allMinutes);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Get By User ID (simple)
export const getUserMinutesByUserId = async (req, res) => {
    try {
        const userMinutes = await UserMinutes.findOne({ userId: req.params.userId });
        if (!userMinutes) return sendResponse(res, 404, 'User minutes not found');
        sendResponse(res, 200, 'User minutes fetched', userMinutes);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Update
export const updateUserMinutes = async (req, res) => {
    try {
        const updated = await UserMinutes.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, 'User minutes not found');
        sendResponse(res, 200, 'User minutes updated', updated);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Delete
export const deleteUserMinutes = async (req, res) => {
    try {
        const deleted = await UserMinutes.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, 'User minutes not found');
        sendResponse(res, 200, 'User minutes deleted');
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
