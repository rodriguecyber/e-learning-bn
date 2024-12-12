import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/config';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import quizRoutes from './routes/quiz.routes';
import resourceRoutes from './routes/resource.routes';
import submissionRoutes from './routes/submission.routes';
import certificateRoutes from './routes/user/certificate.routes';
import notificationRoutes from './routes/user/notification.routes';
import progressRoutes from './routes/user/progress.routes';
import enrollmentRoutes from './routes/user/enrollment.routes'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/enrollement', enrollmentRoutes);

// MongoDB connection
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});