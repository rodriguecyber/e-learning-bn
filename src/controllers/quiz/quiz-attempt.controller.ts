import { Response } from 'express';
import QuizAttempt from '../../models/QuizAttempt';
import Quiz from '../../models/Quiz';
import { AuthRequest } from '../../middleware/auth.middleware';

export class QuizAttemptController {
  static async startQuizAttempt(req: AuthRequest, res: Response) {
    try {
      const { quiz_id } = req.body;
      const user_id = req.user?._id;

      // Check previous attempts
      const attemptCount = await QuizAttempt.countDocuments({ quiz_id, user_id });
      const quiz = await Quiz.findById(quiz_id);

      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      if (attemptCount >= quiz.max_attempts) {
        return res.status(400).json({ message: 'Maximum attempts reached' });
      }

      const quizAttempt = new QuizAttempt({
        quiz_id,
        user_id,
        attempt_number: attemptCount + 1
      });

      await quizAttempt.save();
      res.status(201).json(quizAttempt);
    } catch (error) {
      res.status(500).json({ message: 'Failed to start quiz attempt', error });
    }
  }

  static async submitQuizAttempt(req: AuthRequest, res: Response) {
    try {
      const { answers } = req.body;
      const attempt = await QuizAttempt.findById(req.params.id);

      if (!attempt) {
        return res.status(404).json({ message: 'Quiz attempt not found' });
      }

      if (attempt.completed_at) {
        return res.status(400).json({ message: 'Quiz already submitted' });
      }

      attempt.answers = answers;
      attempt.completed_at = new Date();
      // Calculate score logic here
      
      await attempt.save();
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit quiz attempt', error });
    }
  }

  static async getQuizAttempts(req: AuthRequest, res: Response) {
    try {
      const attempts = await QuizAttempt.find({ user_id: req.user?._id })
        .populate('quiz_id', 'title');
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quiz attempts', error });
    }
  }
}