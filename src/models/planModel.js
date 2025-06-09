import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
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

    classCount: {
        type: Number,
        required: true
    },

    durationInDays: {
        type: Number,
        default: null,
        // Only required if planType is 'subscription'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Plan', planSchema);