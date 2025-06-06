import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema({
    Audio: {
        type: Number,
        default: 0
    },
    Video: {
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
    }
});

const userPremiumPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dailyAudioMinutes: {
        type: Number,
        default: 0
    },
    dailyVideoMinutes: {
        type: Number,
        default: 0
    },
    premiumPlanAudioMinutes: {
        type: Number,
        default: 0
    },
    premiumPlanVideoMinutes: {
        type: Number,
        default: 0
    },
    addon: {
        type: [addonSchema],
        default: []
    }
}, { timestamps: true });

export default mongoose.model('UserMinutes', userPremiumPlanSchema);
