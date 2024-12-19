import { Response } from 'express';
import UserProgress from '../../models/UserProgress';
import Lesson, { ILesson } from '../../models/Lesson';
import Enrollment from '../../models/Enrollment';
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
      const module = await Module.findById(lesson.module_id).populate('lessons')
      if(!module){
        res.status(400).json({message:'module not found'})
        return
      }
       const enrollment = await Enrollment.findOne({user_id,course_id:module.course_id})
       if(!enrollment){
        res.status(400).json({message:"enrolement not found"})
        return
       }
       enrollment.completedLessons +=1 
       //@ts-ignore
       const totaltime = module.lessons.reduce((total, less) => total + less.duration_minutes, 0);
       const percent = totaltime*lesson.duration_minutes/100
       enrollment.progress_percentage+=percent
       await  enrollment.save()
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
  

  
  
  

  
  
  
