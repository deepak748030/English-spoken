import mongoose from 'mongoose';
import moment from 'moment-timezone';

const teacherCourseOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    renewal: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: () => moment.tz('Asia/Kolkata').toDate()
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('TeacherCourseOrder', teacherCourseOrderSchema);
