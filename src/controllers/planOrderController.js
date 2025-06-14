import PlanOrder from '../models/planOrderModel.js';
import Plan from '../models/planModel.js';

// ✅ Create Plan Order
export const createPlanOrder = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

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
        res.status(201).json({ message: 'Plan purchased successfully', data: newOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

        if (!updated) return res.status(404).json({ message: 'Plan order not found' });

        res.status(200).json({ message: 'Plan order updated', data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete Plan Order
export const deletePlanOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await PlanOrder.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Plan order not found' });

        res.status(200).json({ message: 'Plan order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get All Plan Orders
export const getAllPlanOrders = async (req, res) => {
    try {
        const orders = await PlanOrder.find()
            .populate('userId', 'name mobileNo')
            .populate('planId', 'title type planType');

        res.status(200).json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get Plan Orders by User ID
export const getPlanOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await PlanOrder.find({ userId })
            .populate('planId', 'title type planType');

        res.status(200).json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
