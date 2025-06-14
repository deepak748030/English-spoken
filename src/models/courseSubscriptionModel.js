// models/CourseSubscription.js
import mongoose from 'mongoose';

const courseSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    renewalCount: {
        type: Number,
        default: 0 // Represents how many times the subscription was renewed
    },
    isActive: {
        type: Boolean,
        default: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('CourseSubscription', courseSubscriptionSchema);
