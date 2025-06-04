import mongoose from "mongoose";

const teacherTopicContentSubcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['topic', 'topic-content', 'subcategory'],
        required: true,
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function () {
            return this.type !== 'topic';
        },
        refPath: 'type',
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher',
    }
}, { timestamps: true });

export default mongoose.model("TeacherTopicContentSubcategory", teacherTopicContentSubcategorySchema);
