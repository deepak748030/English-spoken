import EbookOrder from '../models/ebookOrderModel.js';
import { sendResponse } from '../utils/response.js';
import Transaction from '../models/transactionModel.js';
import Ebook from '../models/ebookModel.js';

// Create Ebook Order
export const createEbookOrder = async (req, res) => {
    try {
        const order = await EbookOrder.create(req.body);
        // ✅ Add Transaction for Premium Order
        const ebook = await Ebook.findById(req.body.ebookId);
        if (!ebook) return sendResponse(res, 404, 'Ebook not found');

        await Transaction.create({
            amount: ebook.price,
            userId: req.body.userId,
            message: `Ebook Order created`,
            type: 'add'
        });

        sendResponse(res, 201, 'Ebook order created successfully', order);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Get all Ebook Orders
export const getAllEbookOrders = async (req, res) => {
    try {
        const orders = await EbookOrder.find()
            .populate({ path: 'userId', select: 'mobileNo' })
            .populate({ path: 'ebookId', select: 'title price' });
        sendResponse(res, 200, 'All ebook orders fetched', orders);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Get Ebook Orders by User ID
export const getEbookOrdersByUserId = async (req, res) => {
    try {
        const orders = await EbookOrder.find({ userId: req.params.userId })
            .populate({ path: 'userId' })
            .populate({ path: 'ebookId' });
        sendResponse(res, 200, 'Ebook orders by user fetched', orders);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Update Ebook Order
export const updateEbookOrder = async (req, res) => {
    try {
        const updatedOrder = await EbookOrder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedOrder) return sendResponse(res, 404, 'Ebook order not found');
        sendResponse(res, 200, 'Ebook order updated', updatedOrder);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// Delete Ebook Order
export const deleteEbookOrder = async (req, res) => {
    try {
        const deletedOrder = await EbookOrder.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return sendResponse(res, 404, 'Ebook order not found');
        sendResponse(res, 200, 'Ebook order deleted');
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
