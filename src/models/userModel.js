import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String },
    mobileNo: { type: String, required: true, unique: true },
    gmail: { type: String, unique: false, required: false },
    referCode: { type: String, unique: true, default: () => Math.random().toString(36).substr(2, 8).toUpperCase() },
    referredBy: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema); 