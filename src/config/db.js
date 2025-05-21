import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error(`MongoDB error: ${err.message}`);
        throw err;
    }
};

export default connectDB;