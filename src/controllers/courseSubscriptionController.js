// controllers/courseSubscriptionController.js
import CourseSubscription from '../models/courseSubscriptionModel.js';
import { sendResponse } from '../utils/response.js';

export const createSubscription = async (req, res) => {
    try {
        const subscription = await CourseSubscription.create(req.body);
        sendResponse(res, 201, 'Subscription created', subscription);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await CourseSubscription.find()
            .populate({
                path: 'userId',
                select: 'mobileNo'
            })
            .populate({
                path: 'courseId',
                select: 'title'
            });
        sendResponse(res, 200, 'All subscriptions fetched', subscriptions);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const getSubscriptionsByUserId = async (req, res) => {
    try {
        const subscriptions = await CourseSubscription.find({ userId: req.params.userId })
            .populate('userId')
            .populate('courseId');
        sendResponse(res, 200, 'Subscriptions fetched by userId', subscriptions);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const updateSubscription = async (req, res) => {
    try {
        const subscription = await CourseSubscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        sendResponse(res, 200, 'Subscription updated', subscription);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

export const deleteSubscription = async (req, res) => {
    try {
        await CourseSubscription.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Subscription deleted');
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
