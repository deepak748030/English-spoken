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


        // New field for storing selected Course IDs
        courseIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        // New field for selected Ebook IDs
        ebookIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ebook",
            },
        ],

        englishGrammar: {
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
        examEnglishQuiz: {
            type: Boolean,
            default: false,
        },
        freeVideo: {
            type: Boolean,
            default: false,
        },
        listeningPractices: {
            type: Boolean,
            default: false,
        },
        practiceGames: {
            type: Boolean,
            default: false,
        },
        quiz: {
            type: Boolean,
            default: false,
        },
        translationExercises: {
            type: Boolean,
            default: false,
        },
        vocabulary: {
            type: Boolean,
            default: false,
        },
        dailyUseSentences: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const Premium = mongoose.model("Premium", premiumSchema);
export default Premium;
