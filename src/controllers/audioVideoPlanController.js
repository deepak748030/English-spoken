// controllers/audioVideoPlanController.js
import AudioVideoPlan from '../models/AudioVideoPlanModel.js';

// Create a new plan
export const createPlan = async (req, res) => {
    try {
        const { type, audioMinutes, videoMinutes, cost } = req.body;
        const plan = await AudioVideoPlan.create({ type, audioMinutes, videoMinutes, cost });
        res.status(201).json({ message: 'Plan created successfully', data: plan });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all plans
export const getAllPlans = async (req, res) => {
    try {
        const plans = await AudioVideoPlan.find();
        res.status(200).json({ message: 'Plans fetched successfully', data: plans });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single plan by ID
export const getPlanById = async (req, res) => {
    try {
        const plan = await AudioVideoPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan fetched successfully', data: plan });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a plan by ID
export const updatePlan = async (req, res) => {
    try {
        const updates = req.body;
        const updatedPlan = await AudioVideoPlan.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan updated successfully', data: updatedPlan });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a plan by ID
export const deletePlan = async (req, res) => {
    try {
        const deletedPlan = await AudioVideoPlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
