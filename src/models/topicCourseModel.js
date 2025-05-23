// models/Topic.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LessonCourse',
        required: true
    },
    title: String,
    url: String,
    topicNotes: String,
    practiceQuestion: String
}, { timestamps: true });

export default mongoose.model('TopicCourse', topicSchema);
