// src/index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';

import connectDB from './config/db.js';
import logger from './config/logger.js';
import errorHandler from './middleware/errorHandler.js';
import { initSocketServer } from './socket/socketServer.js';

import userRoutes from './routes/userRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import topicContentRoutes from './routes/topicContentRoutes.js';
import subCategoryRoutes from './routes/subCategoryRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import practiceGameRoutes from './routes/practiceGameRoutes.js';
import paraRoutes from './routes/paraRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonCourseRoutes from './routes/lessonCourseRoutes.js';
import topicCourseRoutes from './routes/topicCourseRoutes.js';
import prizeCourseRoutes from './routes/prizeCourseRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join('src', 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', homeRoutes);
app.use('/api', communityRoutes);
app.use('/api', topicRoutes);
app.use('/api', topicContentRoutes);
app.use('/api', subCategoryRoutes);
app.use('/api', quizRoutes);
app.use('/api', practiceGameRoutes);
app.use('/api', paraRoutes);
app.use('/api', resourceRoutes);
app.use('/api', courseRoutes);
app.use('/api/course', lessonCourseRoutes);
app.use('/api/course', topicCourseRoutes);
app.use('/api/course', prizeCourseRoutes);

app.use(errorHandler);

// DB + Server start
connectDB().then(() => {
  initSocketServer(server); // Init socket server
  server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}).catch(err => logger.error(`Startup error: ${err.message}`));
