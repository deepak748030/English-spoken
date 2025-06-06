import mongoose from "mongoose";

const userClassesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    oneToOneClasses: {
        type: Number,
        default: 0
    },
    groupClasses: {
        type: Number,
        default: 0
    },
    trainerTalkClasses: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("UserClasses", userClassesSchema);
