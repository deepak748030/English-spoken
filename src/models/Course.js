// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    banner: { type: String },
    type: {
        type: String,
        // enum: ['english spoken course', 'other teacher course', 'exam english course'],
        required: true
    },
    introVideo: { type: String },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
