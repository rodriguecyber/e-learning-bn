import { Request, Response } from 'express';
import Course from '../../models/Course';
import { AuthRequest } from '../../middleware/auth.middleware';
import Enrollment from '../../models/Enrollment';

export class CourseController {
  static async createCourse(req: any, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file found" });
      }
  
      const courseData = {
        ...req.body,
        instructor_id: req.user?.userId,
        thumbnail: req.file.path, 
      };

      const course = new Course(courseData);
      await course.save();
  
      res.status(201).json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create course', error });
    }
  }

  static async getCourses(req: any, res: Response) {
    try {
      const { difficulty, status, instructor } = req.query;
      let query: any = {};

      if (difficulty) query.difficulty_level = difficulty;
      if (status) query.status = status;
      if (instructor) query.instructor_id = instructor;
  
    
      if (req.user.role === 'student') {
        const enrollments = await Enrollment.find({ user_id: req.user.userId }).select('course_id');
        const courseIds = enrollments.map((enrollment) => enrollment.course_id);
  
        query._id = { $in: courseIds };
      } else if (req.user.role === 'instructor') { 
        query.instructor_id = req.user.userId;
      }
  
      const courses = await Course.find(query)
        .populate('instructor_id', 'full_name expertise rating')
        .sort({ start_date: -1 });
  
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch courses', error });
    }
  }
  

  static async getCourseById(req: Request, res: Response) {
    try {
      const course = await Course.findById(req.params.id)
        .populate('instructor_id', 'full_name expertise rating');
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch course', error });
    }
  }

  static async updateCourse(req: AuthRequest, res: Response) {
    try {
      const course = await Course.findOneAndUpdate(
        { _id: req.params.id, instructor_id: req.user?._id },
        req.body,
        { new: true }
      );

      if (!course) {
        return res.status(404).json({ message: 'Course not found or unauthorized' });
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update course', error });
    }
  }

  static async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const course = await Course.findOneAndDelete({
        _id: req.params.id,
        instructor_id: req.user?._id
      });

      if (!course) {
        return res.status(404).json({ message: 'Course not found or unauthorized' });
      }

      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete course', error });
    }
  }

  static async publishCourse(req: AuthRequest, res: Response) {
    try {
      const course = await Course.findOneAndUpdate(
        { _id: req.params.id, instructor_id: req.user?._id },
        { status: 'published' },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({ message: 'Course not found or unauthorized' });
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Failed to publish course', error });
    }
  }
}