import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    maintenance: { type: Boolean, default: false },
    termsAndConditions: { type: String },
    privacyPolicy: { type: String }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);