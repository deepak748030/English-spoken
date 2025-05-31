import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
