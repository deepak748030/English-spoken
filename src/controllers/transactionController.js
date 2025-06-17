import Transaction from '../models/transactionModel.js';
import { sendResponse } from '../utils/response.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const { userId, title, type } = req.body;

        if (!userId || !title || !type) {
            return sendResponse(res, 400, 'Missing required fields');
        }

        if (!['add', 'deduct'].includes(type)) {
            return sendResponse(res, 400, 'Invalid transaction type');
        }

        const transaction = await Transaction.create({
            userId,
            message: title,
            type
        });

        sendResponse(res, 201, 'Transaction created successfully', transaction);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};



export const getTransactionsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return sendResponse(res, 400, 'User ID is required');
        }

        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

        sendResponse(res, 200, 'Transactions fetched successfully', transactions);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};