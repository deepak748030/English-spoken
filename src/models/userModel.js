import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String },
    mobileNo: { type: String, required: true, unique: true },
    gmail: { type: String, unique: true },
    referCode: { type: String, unique: true, default: () => Math.random().toString(36).substr(2, 8).toUpperCase() },
    referredBy: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model('User', userSchema);