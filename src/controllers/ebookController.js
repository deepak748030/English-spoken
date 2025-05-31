import Ebook from '../models/ebookModel.js';
import EbookOrder from '../models/ebookOrderModel.js';
import { sendResponse } from '../utils/response.js';

// Create Ebook
export const createEbook = async (req, res) => {
    try {
        const data = req.body;
        data.userId = req.body.userId; // from req.body or token auth

        if (req.files) {
            if (req.files.banner?.[0]) {
                data.banner = process.env.IMG_URL + 'pdfs/' + req.files.banner[0].filename;
            }
            if (req.files.demoPdf?.[0]) {
                data.demoPdfUrl = process.env.IMG_URL + 'pdfs/' + req.files.demoPdf[0].filename;
            }
            if (req.files.originalPdf?.[0]) {
                data.originalPdfUrl = process.env.IMG_URL + 'pdfs/' + req.files.originalPdf[0].filename;
            }
        }

        const ebook = await Ebook.create(data);
        sendResponse(res, 201, 'Ebook created', ebook);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get All Ebooks (Admin or public)
export const getAllEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.find().populate('userId', 'name email');
        sendResponse(res, 200, 'All ebooks fetched', ebooks);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get All Ebooks by User ID
export const getEbooksByUserId = async (req, res) => {
    try {
        const ebooks = await Ebook.find({ userId: req.params.userId }).populate('userId', 'name email');
        sendResponse(res, 200, 'Ebooks fetched by user', ebooks);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Update Ebook
export const updateEbook = async (req, res) => {
    try {
        const data = req.body;

        if (req.files) {
            if (req.files.banner?.[0]) {
                data.banner = process.env.IMG_URL + 'pdfs/' + req.files.banner[0].filename;
            }
            if (req.files.demoPdf?.[0]) {
                data.demoPdfUrl = process.env.IMG_URL + 'pdfs/' + req.files.demoPdf[0].filename;
            }
            if (req.files.originalPdf?.[0]) {
                data.originalPdfUrl = process.env.IMG_URL + 'pdfs/' + req.files.originalPdf[0].filename;
            }
        }

        const ebook = await Ebook.findByIdAndUpdate(req.params.id, data, { new: true });
        sendResponse(res, 200, 'Ebook updated', ebook);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Delete Ebook
export const deleteEbook = async (req, res) => {
    try {
        await Ebook.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Ebook deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Order Ebook
export const createEbookOrder = async (req, res) => {
    try {
        const { userId, ebookId } = req.body;
        const order = await EbookOrder.create({ userId, ebookId });
        sendResponse(res, 201, 'Order placed', order);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await EbookOrder.find().populate('userId', 'name email').populate('ebookId');
        sendResponse(res, 200, 'All ebook orders fetched', orders);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get Orders by User
export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await EbookOrder.find({ userId: req.params.userId }).populate('ebookId');
        sendResponse(res, 200, 'User orders fetched', orders);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
