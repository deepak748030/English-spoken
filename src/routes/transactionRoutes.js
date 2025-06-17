import express from 'express';
import { createTransaction, getTransactionsByUser } from '../controllers/transactionController.js';

const router = express.Router();

// POST - Create transaction
router.post('/create', createTransaction);

// GET - Transactions by userId
router.get('/user/:userId', getTransactionsByUser);

export default router;
