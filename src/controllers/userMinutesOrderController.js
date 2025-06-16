import UserMinutesOrder from '../models/userMinutesOrderModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import { sendResponse } from '../utils/response.js';

export const createUserMinutesOrder = async (req, res) => {
    try {
        const { userId, audioMinutes, videoMinutes } = req.body;

        if (!userId || audioMinutes == null || videoMinutes == null) {
            return sendResponse(res, 400, 'userId, audioMinutes and videoMinutes are required');
        }

        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        const newOrder = new UserMinutesOrder({
            userId,
            audioMinutes,
            videoMinutes,
            dailyAudioMinutes: 0,
            dailyVideoMinutes: 0,
            premiumPlanAudioMinutes: 0,
            premiumPlanVideoMinutes: 0,
            endDate
        });

        // await newOrder.save();

        const updatedUserMinutes = await UserMinutes.findOneAndUpdate(
            { userId },
            {
                $inc: {
                    lifetimeAudioMinutes: audioMinutes,
                    lifetimeVideoMinutes: videoMinutes
                }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return sendResponse(res, 201, 'Order created and user minutes updated', {
            userMinutes: updatedUserMinutes
        });
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};


export const getAllUserMinutesOrders = async (req, res) => {
    try {
        const orders = await UserMinutesOrder.find()
            .populate('userId', 'name mobileNo');

        const now = new Date();
        for (const order of orders) {
            if (order.endDate < now && order.status !== 'expired') {
                order.status = 'expired';
                await order.save();
            }
        }

        return sendResponse(res, 200, 'Fetched all user minutes orders', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

export const getUserMinutesOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await UserMinutesOrder.find({ userId });

        const now = new Date();
        for (const order of orders) {
            if (order.endDate < now && order.status !== 'expired') {
                order.status = 'expired';
                await order.save();
            }
        }

        return sendResponse(res, 200, 'Fetched orders for user', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
export const updateUserMinutesOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updated = await UserMinutesOrder.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updated) return sendResponse(res, 404, 'Order not found');
        return sendResponse(res, 200, 'Order updated', updated);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

export const deleteUserMinutesOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await UserMinutesOrder.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, 'Order not found');

        return sendResponse(res, 200, 'Order deleted successfully');
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
