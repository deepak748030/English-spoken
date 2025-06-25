import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // required: true
        },
        message: {
            type: String,
            // required: true
        },
        type: {
            type: String,
            enum: ['add', 'deduct'],
            // required: true
        },
        amount: {
            type: Number,
            // required: true
        },
        createdAtIST: {
            type: String,
            default: () => {
                return new Date().toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour12: true
                });
            }
        }
    },
    { timestamps: true } // createdAt and updatedAt in UTC
);

export default mongoose.model('Transaction', transactionSchema);
