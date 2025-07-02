// models/AudioVideoOrder.js
import mongoose from 'mongoose';

const audioVideoOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    audioVideoPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AudioVideoPlan',
        // required: true
    },
    type: {
        type: String,
        enum: ['monthly', 'yearly'],
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
    cost: {
        type: Number,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model('AudioVideoOrder', audioVideoOrderSchema);
