// models/Lesson.js
import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: String,
    minutes: String
}, { timestamps: true });

export default mongoose.model('LessonCourse', lessonSchema);
