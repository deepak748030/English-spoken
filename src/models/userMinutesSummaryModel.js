import mongoose from 'mongoose';

const usageBreakdownSchema = new mongoose.Schema({
    audioMinutes: {
        type: Number,
        default: 0
    },
    videoMinutes: {
        type: Number,
        default: 0
    }
});

const userMinutesSummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    todayUsed: {
        type: usageBreakdownSchema, // ✅ today's used audio/video minutes
        default: () => ({})
    },

    dailyPurchased: {
        type: usageBreakdownSchema, // ✅ purchased minutes for today
        default: () => ({})
    },

    dailyFree: {
        type: usageBreakdownSchema, // ✅ free minutes for today
        default: () => ({})
    },

    lifetime: {
        type: usageBreakdownSchema, // ✅ total lifetime usage
        default: () => ({})
    },

    totalAudioMinutes: {
        type: Number,
        default: 0
    },

    totalVideoMinutes: {
        type: Number,
        default: 0
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('UserMinutesSummary', userMinutesSummarySchema);
