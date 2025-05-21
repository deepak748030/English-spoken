// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import userRoutes from './routes/userRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import homeRoutes from './routes/homeRoutes.js'
import topicRoutes from './routes/topicRoutes.js';
import topicContentRoutes from './routes/topicContentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import morgan from 'morgan';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join('src', 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', homeRoutes);
app.use('/api', topicRoutes);
app.use('/api', topicContentRoutes);


app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}).catch(err => logger.error(`Startup error: ${err.message}`));