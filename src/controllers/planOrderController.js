import PlanOrder from '../models/planOrderModel.js';
import Plan from '../models/planModel.js';
import { sendResponse } from '../utils/response.js';
import Transaction from '../models/transactionModel.js';

// ✅ Create Plan Order
export const createPlanOrder = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        const plan = await Plan.findById(planId);
        if (!plan) return sendResponse(res, 404, 'Plan not found');

        const expiryDate =
            plan.planType === 'subscription'
                ? new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000)
                : null;

        const newOrder = new PlanOrder({
            userId,
            planId,
            amountPaid: plan.amount,
            classCount: plan.classCount,
            expiryDate
        });

        await newOrder.save();

        await Transaction.create({
            userId,
            message: `Plan Order created`,
            type: 'add'
        });

        return sendResponse(res, 201, 'Plan purchased successfully', newOrder);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Update Plan Order (PATCH)
export const updatePlanOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updated = await PlanOrder.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updated) return sendResponse(res, 404, 'Plan order not found');

        return sendResponse(res, 200, 'Plan order updated', updated);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Delete Plan Order
export const deletePlanOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await PlanOrder.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, 'Plan order not found');

        return sendResponse(res, 200, 'Plan order deleted successfully');
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

// ✅ Get All Plan Orders
export const getAllPlanOrders = async (req, res) => {
    try {
        const orders = await PlanOrder.find()
            .populate('userId', 'name mobileNo')
            .populate('planId', 'title type planType');

        const now = new Date();

        // Check expiry and update status accordingly
        for (const order of orders) {
            if (order.expiryDate && order.planId.planType === 'subscription') {
                const isExpired = order.expiryDate < now;
                const newStatus = isExpired ? 'expired' : 'active';

                if (order.status !== newStatus) {
                    order.status = newStatus;
                    await order.save();
                }
            }
        }

        return sendResponse(res, 200, 'Fetched all plan orders', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};


// ✅ Get Plan Orders by User ID
export const getPlanOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await PlanOrder.find({ userId })
            .populate('planId', 'title type planType');

        const now = new Date();

        for (const order of orders) {
            if (order.expiryDate && order.planId.planType === 'subscription') {
                const isExpired = order.expiryDate < now;
                const newStatus = isExpired ? 'expired' : 'active';

                if (order.status !== newStatus) {
                    order.status = newStatus;
                    await order.save();
                }
            }
        }

        return sendResponse(res, 200, 'Fetched plan orders for user', orders);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
