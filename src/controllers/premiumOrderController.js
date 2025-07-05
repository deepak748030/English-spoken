import moment from 'moment-timezone';
import PremiumOrder from '../models/PremiumOrderModel.js';
import CourseSubscription from '../models/courseSubscriptionModel.js';
import EbookOrder from '../models/ebookOrderModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import Premium from '../models/premiumModel.js';
import Transaction from '../models/transactionModel.js';
import { sendResponse } from '../utils/response.js';
import UserPlan from '../models/UserPlanModel.js';
import AudioVideoOrder from '../models/AudioVideoOrderModel.js';

export const createPremiumOrder = async (req, res) => {
    try {
        const { userId, premiumId, startDate, endDate, duration, razorpaySubscriptionId } = req.body;
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

        // ✅ Handle AudioVideoOrder
        const audioToAdd = audioMinutes * numericDuration;
        const videoToAdd = videoMinutes * numericDuration;

        if (audioToAdd > 0 || videoToAdd > 0) {
            await AudioVideoOrder.create({
                userId,
                audioVideoPlanId: null,
                type: 'monthly',
                audioMinutes: audioToAdd,
                videoMinutes: videoToAdd,
                cost: 0,
                expireAt: endDate,
                status: 'active'
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

        // ✅ Create Premium Order (with optional Razorpay subscription ID)
        const premiumOrder = await PremiumOrder.create({
            userId,
            premiumId,
            startDate,
            endDate,
            duration: numericDuration,
            razorpaySubscriptionId: razorpaySubscriptionId || null
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


export const renewPremiumSubscription = async (req, res) => {
    try {
        const { razorpaySubscriptionId, duration } = req.body;
        const numericDuration = Number(duration);

        if (!razorpaySubscriptionId || isNaN(numericDuration) || numericDuration <= 0) {
            return sendResponse(res, 400, 'Invalid Razorpay Subscription ID or Duration');
        }

        // Get IST time
        const nowIST = moment().tz('Asia/Kolkata');

        // Find existing PremiumOrder
        const premiumOrder = await PremiumOrder.findOne({ razorpaySubscriptionId });
        if (!premiumOrder) return sendResponse(res, 404, 'Premium Order not found');

        const endDateIST = moment(premiumOrder.endDate).tz('Asia/Kolkata');
        if (nowIST.isBefore(endDateIST)) {
            return sendResponse(res, 400, 'Subscription not yet expired');
        }

        // Update PremiumOrder
        premiumOrder.endDate = endDateIST.add(numericDuration, 'months').toDate();
        premiumOrder.renewalCount += 1;
        await premiumOrder.save();

        // Fetch Premium Plan Info
        const premiumPlan = await Premium.findById(premiumOrder.premiumId);
        if (!premiumPlan) return sendResponse(res, 404, 'Premium Plan not found');

        const {
            courseIds = [],
            ebookIds = [],
            audioMinutes = 0,
            videoMinutes = 0,
            oneToOneClasses = 0,
            groupClasses = 0,
            trainerTalkClasses = 0
        } = premiumPlan;

        // 🔁 Update Course Subscriptions
        await Promise.all(courseIds.map(async (courseId) => {
            await CourseSubscription.create({
                userId: premiumOrder.userId,
                courseId,
                startDate: new Date(),
                endDate: premiumOrder.endDate,
                renewalCount: 1,
                isActive: true,
                paymentStatus: 'completed'
            });
        }));

        // 🔁 Update Ebook Orders
        await Promise.all(ebookIds.map(async (ebookId) => {
            await EbookOrder.create({
                userId: premiumOrder.userId,
                ebookId,
                startDate: new Date(),
                endDate: premiumOrder.endDate,
                renewalCount: 1,
                isActive: true,
                paymentStatus: 'completed'
            });
        }));

        // 🔁 Add Audio/Video Minutes
        const audioToAdd = audioMinutes * numericDuration;
        const videoToAdd = videoMinutes * numericDuration;
        if (audioToAdd > 0 || videoToAdd > 0) {
            await AudioVideoOrder.create({
                userId: premiumOrder.userId,
                audioVideoPlanId: null,
                type: 'monthly',
                audioMinutes: audioToAdd,
                videoMinutes: videoToAdd,
                cost: 0,
                expireAt: premiumOrder.endDate,
                status: 'active'
            });
        }

        // 🔁 Update UserPlans (class count)
        const planTypes = [
            { type: 'one-to-one-class', count: oneToOneClasses },
            { type: 'group-class', count: groupClasses },
            { type: 'trainer-talk', count: trainerTalkClasses }
        ];

        for (const plan of planTypes) {
            if (plan.count > 0) {
                await UserPlan.updateOne(
                    {
                        userId: premiumOrder.userId,
                        planId: premiumOrder.premiumId,
                        type: plan.type
                    },
                    {
                        $inc: { remainingClassCount: plan.count * numericDuration }
                    }
                );
            }
        }

        // ✅ Add Transaction Log
        await Transaction.create({
            userId: premiumOrder.userId,
            message: 'Premium Subscription Renewed',
            type: 'add',
            amount: 0 // optional
        });

        return sendResponse(res, 200, 'Premium subscription renewed successfully', premiumOrder);
    } catch (error) {
        console.error('Error renewing subscription:', error);
        return sendResponse(res, 500, error.message);
    }
};
