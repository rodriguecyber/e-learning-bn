import { Request, Response } from 'express';
import Quiz from '../../models/Quiz';
import { AuthRequest } from '../../middleware/auth.middleware';

export class QuizController {
  static async createQuiz(req: AuthRequest, res: Response) {
    try {
      const quiz = new Quiz(req.body);
      await quiz.save();
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create quiz', error });
    }
  }

  static async getQuizzes(req: Request, res: Response) {
    try {
      const { module_id } = req.query;
      const query = module_id ? { module_id } : {};
      
      const quizzes = await Quiz.find(query)
        .populate('module_id', 'title');
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quizzes', error });
    }
  }

  static async getQuizById(req: Request, res: Response) {
    try {
      const quiz = await Quiz.findById(req.params.id)
        .populate('module_id', 'title');
      
      if (!quiz) {
         res.status(404).json({ message: 'Quiz not found' });
         return
      }
      
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quiz', error });
    }
  }

  static async updateQuiz(req: AuthRequest, res: Response) {
    try {
      const quiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!quiz) {
        res.status(404).json({ message: 'Quiz not found' });
        return
      }

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update quiz', error });
    }
  }

  static async deleteQuiz(req: AuthRequest, res: Response) {
    try {
      const quiz = await Quiz.findByIdAndDelete(req.params.id);

      if (!quiz) {
         res.status(404).json({ message: 'Quiz not found' });
         return
      }

      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete quiz', error });
    }
  }
}