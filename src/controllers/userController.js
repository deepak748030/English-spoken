// src/controllers/userController.js
import User from '../models/userModel.js';
import Setting from '../models/settingsModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import logger from '../config/logger.js';
import { sendResponse } from '../utils/response.js';

export const loginOrRegister = async (req, res, next) => {
    try {
        const { mobileNo, password } = req.body;

        if (!mobileNo) return sendResponse(res, 400, 'Mobile number is required');

        let user = await User.findOne({ mobileNo });

        if (user) {
            // Handle login
            if (user.password) {
                if (!password) {
                    return sendResponse(res, 400, 'Password is required for login');
                }

                if (user.password !== password) {
                    return sendResponse(res, 401, 'Incorrect password');
                }

                logger.info(`User logged in: ${user.mobileNo}`);
                return sendResponse(res, 200, 'Login successful', user);
            } else {
                // Password not set → set it now
                if (!password) {
                    return sendResponse(res, 400, 'Password not set. Please provide a password to continue.');
                }

                user.password = password;
                await user.save();

                logger.info(`Password set and user logged in: ${user.mobileNo}`);
                return sendResponse(res, 200, 'Password set successfully and user logged in', user);
            }
        }

        // If user does not exist → register
        const defaultSettings = await Setting.findOne();
        if (!defaultSettings) {
            return sendResponse(res, 500, 'Settings not found');
        }

        user = await User.create({
            mobileNo,
            password: password || null
        });

        await UserMinutes.create({
            userId: user._id,
            dailyAudioMinutes: defaultSettings.DailyFreeAudioMinutes || 0,
            dailyVideoMinutes: defaultSettings.DailyFreeVideoMinutes || 0,
            lifetimeAudioMinutes: 0,
            lifetimeVideoMinutes: 0
        });

        logger.info(`New user created: ${user.mobileNo}`);
        sendResponse(res, 201, 'User created successfully', user);

    } catch (err) {
        next(err);
    }
};





export const updateUser = async (req, res, next) => {
    try {
        const { name, gmail, referredBy } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (gmail !== undefined) updateData.gmail = gmail;
        if (referredBy !== undefined) updateData.referredBy = referredBy || "";
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!user) return sendResponse(res, 404, 'User not found');
        logger.info(`User updated: ${user.gmail || user.mobileNo}`);
        sendResponse(res, 200, 'User updated', user);
    } catch (err) { next(err); }
};

export const blockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return sendResponse(res, 404, 'User not found');
        const newStatus = !user.isBlocked;
        user.isBlocked = newStatus;
        await user.save();
        logger.info(`User ${newStatus ? 'blocked' : 'unblocked'}: ${user.gmail || user.mobileNo}`);
        sendResponse(res, 200, `User ${newStatus ? 'blocked' : 'unblocked'}`, user);
    } catch (err) { next(err); }
}


export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        sendResponse(res, 200, 'Users fetched successfully', users);
    } catch (err) {
        next(err);
    }
};