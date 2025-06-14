import AudioVideoOrder from '../models/AudioVideoOrderModel.js';
import AudioVideoPlan from '../models/AudioVideoPlanModel.js';
import User from '../models/userModel.js';
import { sendResponse } from '../utils/response.js';

// Utility to calculate expiration date
const calculateExpiryDate = (type) => {
    const now = new Date();
    if (type === 'monthly') {
        now.setMonth(now.getMonth() + 1);
    } else if (type === 'yearly') {
        now.setFullYear(now.getFullYear() + 1);
    }
    return now;
};

// ✅ Create an order from userId and audioVideoPlanId
export const createOrder = async (req, res) => {
    try {
        const { userId, audioVideoPlanId } = req.body;

        const user = await User.findById(userId);
        if (!user) return sendResponse(res, 404, 'User not found');

        const plan = await AudioVideoPlan.findById(audioVideoPlanId);
        if (!plan) return sendResponse(res, 404, 'Plan not found');

        const expireAt = calculateExpiryDate(plan.type);

        const newOrder = new AudioVideoOrder({
            userId,
            audioVideoPlanId,
            type: plan.type,
            audioMinutes: plan.audioMinutes,
            videoMinutes: plan.videoMinutes,
            cost: plan.cost,
            expireAt,
            status: 'active'
        });

        await newOrder.save();
        return sendResponse(res, 201, 'Order created', newOrder);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Get all active orders (auto-update expired)
export const getAllOrders = async (req, res) => {
    try {
        const now = new Date();

        // Update expired orders
        await AudioVideoOrder.updateMany(
            { expireAt: { $lte: now }, status: 'active' },
            { $set: { status: 'expired' } }
        );

        const orders = await AudioVideoOrder.find({ status: 'active' })
            .populate('userId', 'name mobileNo');

        return sendResponse(res, 200, 'Fetched all active orders', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Get active orders by userId (auto-update expired)
export const getOrdersByUserId = async (req, res) => {
    try {
        const now = new Date();

        await AudioVideoOrder.updateMany(
            { userId: req.params.userId, expireAt: { $lte: now }, status: 'active' },
            { $set: { status: 'expired' } }
        );

        const orders = await AudioVideoOrder.find({
            userId: req.params.userId,
            status: 'active'
        }).populate('audioVideoPlanId');

        return sendResponse(res, 200, 'Fetched user\'s active orders', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Update an order using PATCH
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedOrder = await AudioVideoOrder.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedOrder) return sendResponse(res, 404, 'Order not found');

        return sendResponse(res, 200, 'Order updated', updatedOrder);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await AudioVideoOrder.findByIdAndDelete(id);

        if (!deletedOrder) return sendResponse(res, 404, 'Order not found');

        return sendResponse(res, 200, 'Order deleted successfully');
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
