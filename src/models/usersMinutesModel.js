import mongoose from 'mongoose';

const userMinutesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        dailyAudioMinutes: {
            type: Number,
            default: 0
        },
        dailyVideoMinutes: {
            type: Number,
            default: 0
        },
        lifetimeAudioMinutes: {
            type: Number,
            default: 0
        },
        lifetimeVideoMinutes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('UserMinutes', userMinutesSchema);
