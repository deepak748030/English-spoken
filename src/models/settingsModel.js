import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    maintenance: { type: Boolean, default: false },
    termsAndConditions: { type: String },
    privacyPolicy: { type: String },

    // New fields for Audio/Video minute costs and free minutes
    PerAudioMinuteCost: { type: Number, default: 0 }, // Cost per 1 audio minute
    PerVideoMinuteCost: { type: Number, default: 0 }, // Cost per 1 video minute
    DailyFreeAudioMinutes: { type: Number, default: 0 }, // Free daily audio minutes
    DailyFreeVideoMinutes: { type: Number, default: 0 } // Free daily video minutes

}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
