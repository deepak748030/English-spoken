import mongoose from 'mongoose';

const translationExerciseSchema = new mongoose.Schema({
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('TranslationExercise', translationExerciseSchema);
