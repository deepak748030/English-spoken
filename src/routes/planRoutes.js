import express from 'express';
import {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
} from '../controllers/planController.js';

const router = express.Router();

router.post('/create', createPlan);           // POST /api/plans/create
router.get('/', getAllPlans);                 // GET  /api/plans?type=one-to-one-class&planType=subscription
router.get('/:id', getPlanById);              // GET  /api/plans/:id
router.patch('/:id', updatePlan);             // PATCH /api/plans/:id
router.delete('/:id', deletePlan);            // DELETE /api/plans/:id

export default router;
