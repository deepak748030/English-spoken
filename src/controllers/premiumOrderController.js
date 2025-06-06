import PremiumOrder from '../models/PremiumOrderModel.js';
import CourseSubscription from '../models/courseSubscriptionModel.js';
import { sendResponse } from '../utils/response.js';

export const createPremiumOrder = async (req, res) => {
    try {
        // const orderCourse = await CourseSubscription.create 
        const order = await PremiumOrder.create(req.body);
        sendResponse(res, 201, 'Premium order created', order);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const getAllPremiumOrders = async (req, res) => {
    try {
        const orders = await PremiumOrder.find()
            .populate({ path: 'userId', select: 'mobileNo' })
            .populate({ path: 'premiumId', select: 'title' });
        sendResponse(res, 200, 'All premium orders fetched', orders);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const getPremiumOrdersByUserId = async (req, res) => {
    try {
        const orders = await PremiumOrder.find({ userId: req.params.userId })
            .populate({ path: 'userId', select: 'mobileNo' })
            .populate({ path: 'premiumId', select: 'title' });
        sendResponse(res, 200, 'Premium orders by user fetched', orders);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const updatePremiumOrder = async (req, res) => {
    try {
        const updated = await PremiumOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Premium order updated', updated);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const deletePremiumOrder = async (req, res) => {
    try {
        await PremiumOrder.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Premium order deleted');
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
