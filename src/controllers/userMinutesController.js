import UserMinutes from '../models/usersMinutesModel.js';
import { sendResponse } from '../utils/response.js';

// ✅ Create or Update (Upsert)
export const createOrUpdateUserMinutes = async (req, res) => {
    try {
        const { userId, dailyAudioMinutes, dailyVideoMinutes, lifetimeAudioMinutes, lifetimeVideoMinutes } = req.body;

        const userMinutes = await UserMinutes.findOneAndUpdate(
            { userId },
            {
                $set: {
                    dailyAudioMinutes,
                    dailyVideoMinutes,
                    lifetimeAudioMinutes,
                    lifetimeVideoMinutes
                }
            },
            { new: true, upsert: true, runValidators: true }
        );

        return sendResponse(res, 200, 'User minutes saved successfully', userMinutes);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Get All Users' Minutes
export const getAllUserMinutes = async (req, res) => {
    try {
        const all = await UserMinutes.find().populate('userId', 'name mobileNo');
        return sendResponse(res, 200, 'Fetched all user minutes', all);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Get by userId
export const getUserMinutesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const minutes = await UserMinutes.findOne({ userId }).populate('userId', 'name mobileNo');
        if (!minutes) return sendResponse(res, 404, 'No user minutes found');

        return sendResponse(res, 200, 'Fetched user minutes', minutes);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Update using PATCH
export const updateUserMinutes = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updated = await UserMinutes.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updated) return sendResponse(res, 404, 'UserMinutes not found');
        return sendResponse(res, 200, 'UserMinutes updated successfully', updated);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Delete user minutes
export const deleteUserMinutes = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await UserMinutes.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, 'UserMinutes not found');

        return sendResponse(res, 200, 'UserMinutes deleted successfully');
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
