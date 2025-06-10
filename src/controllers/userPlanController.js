import UserPlan from '../models/UserPlanModel.js';
import Plan from '../models/planModel.js';
import moment from 'moment-timezone';
import { sendResponse } from '../utils/response.js'
import mongoose from 'mongoose';

export const createUserPlan = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        // Find the plan
        const plan = await Plan.findById(planId);
        if (!plan) return sendResponse(res, 404, 'Plan not found');

        const isOneTime = plan.planType === 'one-time';

        if (isOneTime) {
            // Check for existing active one-time plan
            const existingPlan = await UserPlan.findOne({
                userId,
                planType: 'one-time',
                status: 'active'
            });

            if (existingPlan) {
                // Update existing one-time plan by adding classes
                existingPlan.remainingClassCount += plan.classCount;
                await existingPlan.save();
                return sendResponse(res, 200, 'Added classes to existing one-time plan', { plan: existingPlan });
            }
        } else {
            // Validate durationInDays for subscription plans
            if (!plan.durationInDays && plan.planType === 'subscription') {
                return sendResponse(res, 400, 'Duration in days is required for subscription plans');
            }
        }

        // Create new plan (for both new one-time plans and all subscription plans)
        const expiryDate = plan.planType === 'subscription'
            ? moment.tz('Asia/Kolkata').add(plan.durationInDays, 'days').toDate()
            : null;

        const newPlan = await UserPlan.create({
            userId,
            planId,
            planType: plan.planType,
            remainingClassCount: plan.classCount,
            expiryDate
        });

        return sendResponse(res, 200, 'New plan created', { plan: newPlan });

    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, 'Internal server error');
    }
};

export const deductUserClass = async (req, res) => {
    try {
        const { userId } = req.body;

        // Step 1: Check subscription plan first (sorted by purchase time)
        const subscriptionPlan = await UserPlan.findOne({
            userId,
            planType: 'subscription',
            status: 'active',
            expiryDate: { $gte: moment.tz('Asia/Kolkata').startOf('day').toDate() },
            remainingClassCount: { $gt: 0 }
        }).sort({ createdAt: 1 });

        if (subscriptionPlan) {
            subscriptionPlan.remainingClassCount -= 1;

            if (subscriptionPlan.remainingClassCount === 0 || moment(subscriptionPlan.expiryDate).isBefore(moment.tz('Asia/Kolkata'))) {
                subscriptionPlan.status = 'expired';
            }

            await subscriptionPlan.save();
            return sendResponse(res, 200, 'Class deducted from subscription plan', { plan: subscriptionPlan });
        }

        // Step 2: Try one-time plan
        const oneTimePlan = await UserPlan.findOne({
            userId,
            planType: 'one-time',
            status: 'active',
            remainingClassCount: { $gt: 0 }
        });

        if (oneTimePlan) {
            oneTimePlan.remainingClassCount -= 1;

            if (oneTimePlan.remainingClassCount === 0) {
                oneTimePlan.status = 'expired';
            }

            await oneTimePlan.save();
            return sendResponse(res, 200, 'Class deducted from one-time plan', { plan: oneTimePlan });
        }

        return sendResponse(res, 400, 'No available classes left in any plan');

    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, 'Error while deducting class');
    }
};

export const getTotalClasses = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendResponse(res, 400, 'Invalid user ID format');
        }

        // Aggregate total remaining classes across all active plans for the user
        const totalClasses = await UserPlan.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    status: 'active',
                    remainingClassCount: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRemainingClasses: { $sum: '$remainingClassCount' },
                    subscriptionClasses: {
                        $sum: {
                            $cond: [
                                { $eq: ['$planType', 'subscription'] },
                                '$remainingClassCount',
                                0
                            ]
                        }
                    },
                    oneTimeClasses: {
                        $sum: {
                            $cond: [
                                { $eq: ['$planType', 'one-time'] },
                                '$remainingClassCount',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // If no active plans with classes are found, return zeros
        const result = totalClasses.length > 0
            ? {
                totalRemainingClasses: totalClasses[0].totalRemainingClasses,
                subscriptionClasses: totalClasses[0].subscriptionClasses,
                oneTimeClasses: totalClasses[0].oneTimeClasses
            }
            : {
                totalRemainingClasses: 0,
                subscriptionClasses: 0,
                oneTimeClasses: 0
            };

        return sendResponse(res, 200, 'Total classes retrieved successfully', result);

    } catch (err) {
        console.error('Error in getTotalClasses:', err);
        return sendResponse(res, 500, `Error while retrieving total classes: ${err.message}`);
    }
};