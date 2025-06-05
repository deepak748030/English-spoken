import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    youtubeUrl: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['free', 'subscription', 'course'],
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher'
    },
    courseIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, {
    timestamps: true
});

// ✅ Ensure pre-save validation works reliably
liveClassSchema.pre('validate', function (next) {
    if (this.type === 'course' && (!Array.isArray(this.courseIds) || this.courseIds.length === 0)) {
        return next(new Error('At least one course must be selected for type "course"'));
    }
    next();
});

export default mongoose.model('TeacherLiveClass', liveClassSchema);
