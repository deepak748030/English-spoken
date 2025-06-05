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
import vocabularyRoutes from './routes/vocabularyRoutes.js';
import freeVideoRoutes from './routes/freeVideoRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonCourseRoutes from './routes/lessonCourseRoutes.js';
import topicCourseRoutes from './routes/topicCourseRoutes.js';
import prizeCourseRoutes from './routes/prizeCourseRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import courseSubscriptionRoutes from './routes/courseSubscriptionRoutes.js';
import dailyUseSentenceRoutes from './routes/dailyUseSentenceRoutes.js';
import translationExerciseRoutes from './routes/translationExerciseRoutes.js';
import listeningPracticeRoutes from './routes/listeningPracticeRoutes.js';
import ebookRoutes from './routes/ebookRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import premiumRoutes from './routes/premiumRoutes.js';
import teacherTopicContentSubcategory from './routes/teacherTopicContentSubcategoryRoutes.js';
import teacherLiveClassRoutes from './routes/taecherLiveClassRoutes.js';
import teacherCourseOrderRoutes from './routes/teacherCourseOrderRoutes.js';
import teacherCourseRoutes from './routes/teacherCourseRoutes.js'
import teacherDashboardRoutes from './routes/teacherDashboardRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join('src', 'uploads')));
app.use('/uploads/pdf', express.static(path.join('src', 'uploads', 'pdf')));



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
app.use('/api', vocabularyRoutes);
app.use('/api', freeVideoRoutes);
app.use('/api', courseRoutes);
app.use('/api', ebookRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api', listeningPracticeRoutes);
app.use('/api', dailyUseSentenceRoutes);
app.use('/api/translation-expercise', translationExerciseRoutes);
app.use('/api', courseSubscriptionRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/teacher-topic-content', teacherTopicContentSubcategory);
app.use('/api/teacher-live-class', teacherLiveClassRoutes);
app.use('/api/teacher-course-orders', teacherCourseOrderRoutes);
app.use('/api', teacherCourseRoutes);
app.use('/api/course', lessonCourseRoutes);
app.use('/api/course', topicCourseRoutes);
app.use('/api/course', prizeCourseRoutes);
app.use('/api', teacherDashboardRoutes);


app.use(errorHandler);


// DB + Server start
connectDB().then(() => {
  initSocketServer(server); // Init socket server
  server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}).catch(err => logger.error(`Startup error: ${err.message}`));
