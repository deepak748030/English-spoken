import mongoose from 'mongoose';

const audioVideoPlanSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    audioMinutes: {
        type: Number,
        required: true
    },
    videoMinutes: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('AudioVideoPlan', audioVideoPlanSchema);
