// controllers/audioVideoOrderController.js
import AudioVideoOrder from '../models/AudioVideoOrderModel.js';
import AudioVideoPlan from '../models/AudioVideoPlanModel.js';
import User from '../models/userModel.js';

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

// Create an order from userId and audioVideoPlanId
export const createOrder = async (req, res) => {
    try {
        const { userId, audioVideoPlanId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const plan = await AudioVideoPlan.findById(audioVideoPlanId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

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
        res.status(201).json({ message: 'Order created', data: newOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all active orders (filter out expired and update status)
export const getAllOrders = async (req, res) => {
    try {
        const now = new Date();

        // // Update expired orders
        await AudioVideoOrder.updateMany(
            { expireAt: { $lte: now }, status: 'active' },
            { $set: { status: 'expired' } }
        );

        const orders = await AudioVideoOrder.find({ status: 'active' })
            .populate('userId', 'name mobileNo')
        // .populate('audioVideoPlanId');

        res.status(200).json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get active orders by userId (update status if expired)
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

        res.status(200).json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an order using patch
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedOrder = await AudioVideoOrder.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order updated', data: updatedOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await AudioVideoOrder.findByIdAndDelete(id);

        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
