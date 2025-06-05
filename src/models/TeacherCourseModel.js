import mongoose from 'mongoose';

const teacherCourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    coverImg: {
        type: String,
        required: true
    },
    demoPdf: {
        type: String,
        required: true
    },
    originalPdf: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherTopicContentSubcategory',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('TeacherCourse', teacherCourseSchema);
