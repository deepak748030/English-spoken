import mongoose from 'mongoose';
import moment from 'moment-timezone';

const userPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    type: {
        type: String,
        enum: ['one-to-one-class', 'group-class', 'trainer-talk'],
        required: true
    },

    planType: {
        type: String,
        enum: ['subscription', 'one-time'],
        required: true
    },

    remainingClassCount: {
        type: Number,
        required: true
    },

    expiryDate: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },

    createdAt: {
        type: Date,
        default: () => moment.tz('Asia/Kolkata').toDate()
    }
});

export default mongoose.model('UserPlan', userPlanSchema);
