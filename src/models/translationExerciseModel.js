import mongoose from "mongoose";

const translationExerciseSchema = new mongoose.Schema(
    {
        questions: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
            },
        ],
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true,
        },
    },
    { timestamps: true }
);

const TranslationExercise = mongoose.model("TranslationExercise", translationExerciseSchema);
export default TranslationExercise;
