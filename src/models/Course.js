// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    banner: { type: String },
    type: {
        type: String,
        required: true
        // enum: ['english spoken course', 'other teacher', 'exam english course'],
    },
    introVideo: { type: String },
    description: { type: String },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
