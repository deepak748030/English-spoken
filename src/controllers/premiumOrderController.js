import PremiumOrder from '../models/PremiumOrderModel.js';
import CourseSubscription from '../models/courseSubscriptionModel.js';
import EbookOrder from '../models/ebookOrderModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import Premium from '../models/premiumModel.js';
import { sendResponse } from '../utils/response.js';

export const createPremiumOrder = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, premiumId, startDate, endDate } = req.body;

        // Fetch Premium details
        const premiumInfo = await Premium.findById(premiumId);
        if (!premiumInfo) return sendResponse(res, 404, 'Premium plan not found');

        const {
            courseIds = [],
            ebookIds = [],
            audioMinutes = 0,
            videoMinutes = 0
        } = premiumInfo;

        // ✅ Insert Course Subscriptions
        const courseSubscriptions = courseIds.map(courseId => ({
            userId,
            courseId,
            startDate,
            endDate,
            isActive: true,
            renewalCount: 0,
            paymentStatus: 'completed'
        }));
        await CourseSubscription.insertMany(courseSubscriptions);

        // ✅ Insert Ebook Orders
        const ebookOrders = ebookIds.map(ebookId => ({
            userId,
            ebookId,
            startDate,
            endDate,
            paymentStatus: 'completed'
        }));
        await EbookOrder.insertMany(ebookOrders);

        // ✅ Handle UserMinutes
        const existingUserMinutes = await UserMinutes.findOne({ userId });

        if (existingUserMinutes) {
            // Update: add minutes to existing values
            existingUserMinutes.premiumPlanAudioMinutes += audioMinutes;
            existingUserMinutes.premiumPlanVideoMinutes += videoMinutes;
            await existingUserMinutes.save();
        } else {
            // Create new UserMinutes
            await UserMinutes.create({
                userId,
                premiumPlanAudioMinutes: audioMinutes,
                premiumPlanVideoMinutes: videoMinutes
            });
        }

        // ✅ Create Premium Order
        const premiumOrder = await PremiumOrder.create(req.body);

        sendResponse(res, 201, 'Premium order created successfully', premiumOrder);
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
