import { Response } from 'express';
import UserProgress from '../../models/UserProgress';
import Lesson from '../../models/Lesson';
import { AuthRequest } from '../../middleware/auth.middleware';
import Module from '../../models/Module';

export class ProgressController {
  static async updateProgress(req: any, res: Response) {
    try {
      const {lessonId}= req.params
      const {time_spent, is_completed, notes } = req.body;
      const user_id = req.user?.userId;

      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' }); 
      }

      const progress = await UserProgress.findOneAndUpdate(
        { user_id, lesson_id:lessonId },
        {
          $set: {
            is_completed,
            notes
          },
          $inc: { time_spent: time_spent || 0 },
          // $set: { last_accessed: new Date() }
        },
        { new: true, upsert: true }
      );
       
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update progress', error });
    }
  }

  static async getUserProgress(req: any, res: Response) {
    try {
      const { module_id } = req.query;
      let query: any = { user_id: req.user?.userId };

      if (module_id) {
        const lessons = await Lesson.find({ module_id }).select('_id');
        const lessonIds = lessons.map(lesson => lesson._id); 
        query.lesson_id = { $in: lessonIds };
      }

      const progress = await UserProgress.find(query)
        .populate('lesson_id', 'title content_type duration_minutes')
        .sort({ last_accessed: -1 });

      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch progress', error });
    }
  }

  }
  

  
  
  

  
  
  
