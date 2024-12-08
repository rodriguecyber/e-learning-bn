import { Response } from 'express';
import UserProgress from '../../models/UserProgress';
import Lesson from '../../models/Lesson';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ProgressController {
  static async updateProgress(req: AuthRequest, res: Response) {
    try {
      const { lesson_id, time_spent, is_completed, notes } = req.body;
      const user_id = req.user?._id;

      const lesson = await Lesson.findById(lesson_id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      const progress = await UserProgress.findOneAndUpdate(
        { user_id, lesson_id },
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

  static async getUserProgress(req: AuthRequest, res: Response) {
    try {
      const { module_id } = req.query;
      let query: any = { user_id: req.user?._id };

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

  static async getProgressSummary(req: AuthRequest, res: Response) {
    try {
      const { course_id } = req.params;
      const user_id = req.user?._id;

      const modules = await Lesson.aggregate([
        { $match: { course_id: course_id } },
        {
          $lookup: {
            from: 'userprogresses',
            let: { lesson_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$lesson_id', '$$lesson_id'] },
                      { $eq: ['$user_id', user_id] }
                    ]
                  }
                }
              }
            ],
            as: 'progress'
          }
        },
        {
          $group: {
            _id: '$module_id',
            total_lessons: { $sum: 1 },
            completed_lessons: {
              $sum: {
                $cond: [{ $gt: [{ $size: '$progress' }, 0] }, 1, 0]
              }
            },
            total_duration: { $sum: '$duration_minutes' },
            time_spent: { $sum: { $arrayElemAt: ['$progress.time_spent', 0] } }
          }
        }
      ]);

      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch progress summary', error });
    }
  }
}