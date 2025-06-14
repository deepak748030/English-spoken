import UserMinutesOrder from '../models/userMinutesOrderModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import { sendResponse } from '../utils/response.js';

// ✅ Create a new User Minutes Order
// ✅ Create a new User Minutes Order using only userId and userMinutesId
export const createUserMinutesOrder = async (req, res) => {
    try {
        const { userId, userMinutesId } = req.body;

        const userMinutes = await UserMinutes.findById(userMinutesId);
        if (!userMinutes) return sendResponse(res, 404, 'UserMinutes not found');

        const {
            dailyAudioMinutes,
            dailyVideoMinutes,
            premiumPlanAudioMinutes,
            premiumPlanVideoMinutes
        } = userMinutes;

        // Default endDate: 30 days from now
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const newOrder = new UserMinutesOrder({
            userId,
            userMinutesId,
            amountPaid: 0, // Or set amount from req.body if needed
            dailyAudioMinutes,
            dailyVideoMinutes,
            premiumPlanAudioMinutes,
            premiumPlanVideoMinutes,
            endDate
        });

        await newOrder.save();
        return sendResponse(res, 201, 'User minutes order created successfully', newOrder);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};


// ✅ Get all orders and auto update status if expired
export const getAllUserMinutesOrders = async (req, res) => {
    try {
        const orders = await UserMinutesOrder.find()
            .populate('userId', 'name mobileNo')
            .populate('userMinutesId');

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

// ✅ Get orders by user ID and auto update status
export const getUserMinutesOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await UserMinutesOrder.find({ userId })
            .populate('userMinutesId');

        const now = new Date();
        for (const order of orders) {
            if (order.endDate < now && order.status !== 'expired') {
                order.status = 'expired';
                await order.save();
            }
        }

        return sendResponse(res, 200, 'Fetched user minutes orders', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Update order
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

// ✅ Delete order
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
