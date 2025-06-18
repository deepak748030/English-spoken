import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    maintenance: { type: Boolean, default: false },
    termsAndConditions: { type: String },
    privacyPolicy: { type: String },

    // New fields
    refundPolicy: { type: String },
    communityGuidelines: { type: String },
    aboutUs: { type: String },

    // Audio/Video minute costs and free minutes
    PerAudioMinuteCost: { type: Number, default: 0 },
    PerVideoMinuteCost: { type: Number, default: 0 },
    DailyFreeAudioMinutes: { type: Number, default: 0 },
    DailyFreeVideoMinutes: { type: Number, default: 0 },

    // YouTube Intro Video URLs
    oneToOneClassIntroUrl: { type: String, default: '' },
    groupClassIntroUrl: { type: String, default: '' },
    trainerClassIntroUrl: { type: String, default: '' }

}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
