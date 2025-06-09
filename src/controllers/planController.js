import Plan from '../models/planModel.js';
import { sendResponse } from '../utils/response.js'; // you already use this

// Create new plan
export const createPlan = async (req, res) => {
    try {
        const { title, amount, type, planType, classCount, durationInDays } = req.body;

        if (!title || !amount || !type || !planType || !classCount) {
            return sendResponse(res, 400, 'All required fields must be filled');
        }

        if (planType === 'subscription' && !durationInDays) {
            return sendResponse(res, 400, 'durationInDays is required for subscription');
        }

        const newPlan = await Plan.create({
            title,
            amount,
            type,
            planType,
            classCount,
            durationInDays: planType === 'subscription' ? durationInDays : null,
        });

        sendResponse(res, 201, 'Plan created successfully', newPlan);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get all plans (optional filter)
export const getAllPlans = async (req, res) => {
    try {
        const { type, planType } = req.query;

        const filter = {};
        if (type) filter.type = type;
        if (planType) filter.planType = planType;

        const plans = await Plan.find(filter);
        sendResponse(res, 200, 'All plans fetched', plans);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return sendResponse(res, 404, 'Plan not found');
        sendResponse(res, 200, 'Plan found', plan);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Update plan
export const updatePlan = async (req, res) => {
    try {
        const { title, amount, type, planType, classCount, durationInDays } = req.body;

        const updated = await Plan.findByIdAndUpdate(
            req.params.id,
            {
                title,
                amount,
                type,
                planType,
                classCount,
                durationInDays: planType === 'subscription' ? durationInDays : null,
            },
            { new: true }
        );

        if (!updated) return sendResponse(res, 404, 'Plan not found');
        sendResponse(res, 200, 'Plan updated', updated);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Delete plan
export const deletePlan = async (req, res) => {
    try {
        const deleted = await Plan.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, 'Plan not found');
        sendResponse(res, 200, 'Plan deleted', deleted);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
