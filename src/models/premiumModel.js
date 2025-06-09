import mongoose from "mongoose";

const premiumSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        // Subscription Prices by Duration
        oneMonthPrice: {
            type: Number,
            required: true,
        },
        threeMonthPrice: {
            type: Number,
            required: true,
        },
        sixMonthPrice: {
            type: Number,
            required: true,
        },
        twelveMonthPrice: {
            type: Number,
            required: true,
        },

        // Media Usage Limits
        audioMinutes: {
            type: Number,
            default: 0,
        },
        videoMinutes: {
            type: Number,
            default: 0,
        },

        // Class Access Limits
        oneToOneClasses: {
            type: Number,
            default: 0,
        },
        groupClasses: {
            type: Number,
            default: 0,
        },
        trainerTalkClasses: {
            type: Number,
            default: 0,
        },

        // Included Courses
        courseIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        // Included Ebooks
        ebookIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ebook",
            },
        ],

        // Features
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
        },
    },
    { timestamps: true }
);

const Premium = mongoose.model("Premium", premiumSchema);
export default Premium;
