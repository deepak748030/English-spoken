import mongoose from "mongoose";

const premiumSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        audioMinutes: {
            type: Number,
            default: 0,
        },
        videoMinutes: {
            type: Number,
            default: 0,
        },

        // Keep this as you mentioned
        courseType: {
            type: String,
            enum: ["spoken-english", "exam-english"],
            required: true,
        },

        // New field for storing selected Course IDs
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        // New field for selected Ebook IDs
        ebooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ebook",
            },
        ],

        description: {
            type: String,
        },

        practiceGames: {
            type: Boolean,
            default: false,
        },
        dailyUseSentences: {
            type: Boolean,
            default: false,
        },
        listeningPractices: {
            type: Boolean,
            default: false,
        },
        translationExercise: {
            type: Boolean,
            default: false,
        },
        englishGrammar: {
            type: Boolean,
            default: false,
        },
        vocabulary: {
            type: Boolean,
            default: false,
        },
        freeVideo: {
            type: Boolean,
            default: false,
        },
        quiz: {
            type: Boolean,
            default: false,
        },
        examEnglishQuiz: {
            type: Boolean,
            default: false,
        },
        examEnglishFreeVideo: {
            type: Boolean,
            default: false,
        },
        examEnglishGrammar: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Premium = mongoose.model("Premium", premiumSchema);
export default Premium;
