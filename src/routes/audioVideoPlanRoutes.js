// routes/audioVideoPlanRoutes.js
import express from 'express';
import {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan
} from '../controllers/audioVideoPlanController.js';

const router = express.Router();

// Create a new audio/video plan
router.post('/', createPlan);

// Get all audio/video plans
router.get('/', getAllPlans);

// Get a single plan by ID
router.get('/:id', getPlanById);

// Update a plan by ID
router.patch('/:id', updatePlan);

// Delete a plan by ID
router.delete('/:id', deletePlan);

export default router;