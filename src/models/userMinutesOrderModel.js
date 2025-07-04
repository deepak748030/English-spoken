import mongoose from 'mongoose';

const userMinutesOrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        audioMinutes: {
            type: Number,
            default: 0
        },

        videoMinutes: {
            type: Number,
            default: 0
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ['active', 'expired'],
            default: 'active'
        }
    },
    { timestamps: true }
);

export default mongoose.model('UserMinutesOrder', userMinutesOrderSchema);
