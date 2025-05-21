// src/controllers/userController.js
import User from '../models/userModel.js';
import logger from '../config/logger.js';
import { sendResponse } from '../utils/response.js';

export const loginOrRegister = async (req, res, next) => {
    try {
        const { mobileNo } = req.body;
        let user = await User.findOne({ mobileNo });
        if (user) {
            logger.info(`User logged in: ${user.mobileNo}`);
            return sendResponse(res, 200, 'User found', user);
        }
        user = await User.create({ mobileNo });
        logger.info(`User created: ${user.mobileNo}`);
        sendResponse(res, 201, 'User created', user);
    } catch (err) { next(err); }
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