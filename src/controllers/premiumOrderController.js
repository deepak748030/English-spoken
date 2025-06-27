import PremiumOrder from '../models/PremiumOrderModel.js';
import CourseSubscription from '../models/courseSubscriptionModel.js';
import EbookOrder from '../models/ebookOrderModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import Premium from '../models/premiumModel.js';
import Transaction from '../models/transactionModel.js';
import { sendResponse } from '../utils/response.js';
import UserPlan from '../models/UserPlanModel.js';

export const createPremiumOrder = async (req, res) => {
    try {
        const { userId, premiumId, startDate, endDate, duration } = req.body;
        const planType = 'one-time'; // ✅ Always one-time

        const numericDuration = Number(duration);
        if (isNaN(numericDuration)) {
            return sendResponse(res, 400, "Invalid duration, must be a number");
        }

        // ✅ Fetch Premium details
        const premiumInfo = await Premium.findById(premiumId);
        if (!premiumInfo) return sendResponse(res, 404, 'Premium plan not found');

        const {
            courseIds = [],
            ebookIds = [],
            audioMinutes = 0,
            videoMinutes = 0,
            oneToOneClasses = 0,
            groupClasses = 0,
            trainerTalkClasses = 0
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
        if (courseSubscriptions.length) {
            await CourseSubscription.insertMany(courseSubscriptions);
        }

        // ✅ Insert Ebook Orders
        const ebookOrders = ebookIds.map(ebookId => ({
            userId,
            ebookId,
            startDate,
            endDate,
            paymentStatus: 'completed'
        }));
        if (ebookOrders.length) {
            await EbookOrder.insertMany(ebookOrders);
        }

        // ✅ Handle UserMinutes
        const existingUserMinutes = await UserMinutes.findOne({ userId });

        if (existingUserMinutes) {
            existingUserMinutes.premiumPlanAudioMinutes += audioMinutes * numericDuration;
            existingUserMinutes.premiumPlanVideoMinutes += videoMinutes * numericDuration;
            await existingUserMinutes.save();
        } else {
            await UserMinutes.create({
                userId,
                premiumPlanAudioMinutes: audioMinutes * numericDuration,
                premiumPlanVideoMinutes: videoMinutes * numericDuration
            });
        }

        // ✅ Add UserPlan entries
        const expiryDate = null; // Always one-time => no expiry
        const userPlans = [];

        if (oneToOneClasses > 0) {
            userPlans.push({
                userId,
                planId: premiumId,
                type: 'one-to-one-class',
                planType,
                remainingClassCount: oneToOneClasses * numericDuration,
                expiryDate
            });
        }

        if (groupClasses > 0) {
            userPlans.push({
                userId,
                planId: premiumId,
                type: 'group-class',
                planType,
                remainingClassCount: groupClasses * numericDuration,
                expiryDate
            });
        }

        if (trainerTalkClasses > 0) {
            userPlans.push({
                userId,
                planId: premiumId,
                type: 'trainer-talk',
                planType,
                remainingClassCount: trainerTalkClasses * numericDuration,
                expiryDate
            });
        }

        if (userPlans.length > 0) {
            await UserPlan.insertMany(userPlans);
        }

        // ✅ Create Premium Order
        const premiumOrder = await PremiumOrder.create({
            ...req.body,
            planType // Optional if you want to store it
        });

        // ✅ Add Transaction
        await Transaction.create({
            userId,
            message: "Premium Order created",
            type: 'add'
        });

        sendResponse(res, 201, 'Premium order created successfully', premiumOrder);
    } catch (error) {
        console.error("Error in createPremiumOrder:", error);
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
            .populate({ path: 'premiumId' });
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
