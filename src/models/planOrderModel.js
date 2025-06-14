import mongoose from 'mongoose';

const planOrderSchema = new mongoose.Schema({
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

    amountPaid: {
        type: Number,
        required: true
    },

    classCount: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    expiryDate: {
        type: Date,
        default: null // can be null for one-time plans
    },

    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('PlanOrder', planOrderSchema);
