// models/Prize.js
import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    month: Number,
    title: String,
    withoutDiscountPrize: Number,
    withDiscountPrize: Number
}, { timestamps: true });

export default mongoose.model('PrizeCourse', prizeSchema);
