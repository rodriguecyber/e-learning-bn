import { Response } from 'express';
import Submission from '../../models/Submission';
import Assignment from '../../models/Assignment';
import { AuthRequest } from '../../middleware/auth.middleware';

export class SubmissionController {
  static async createSubmission(req: any, res: Response) {
    try {
      const { assignment_id } = req.params;
      const { content } = req.body;
      const file = req.file;

      if (!content) {
        return res.status(400).json({ message: 'Submission content is required' });
      }

      const assignment = await Assignment.findById(assignment_id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      
console.log(file)
      const submission = new Submission({
        content,
        file_url: file.path,
        user_id: req.user?.userId,
        assignment_id,
        status: new Date() > new Date(assignment.due_date) ? 'late' : 'pending'
      });

      await submission.save();
      res.status(201).json(submission);
    } catch (error) {
      console.error('Error creating submission:', error);
      res.status(500).json({ message: 'Failed to create submission', error: (error as Error).message });
    }
  }

  static async gradeSubmission(req: AuthRequest, res: Response) {
    try {
      const { score, feedback } = req.body;
      const submission = await Submission.findByIdAndUpdate(
        req.params.id,
        { 
          score,
          feedback,
          status: 'graded'
        },
        { new: true }
      );

      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: 'Failed to grade submission', error });
    }
  }

  static async getSubmissions(req: any, res: Response) {     
    try {       
      const { assignment_id } = req.params;       
      const query: any = { assignment_id }; 
  
      if (req.user?.role === 'student') {         
        query.user_id = req.user.userId;  
      }
  
      const submissions = req.user?.role === 'student' 
        ? await Submission.findOne(query) .populate('user_id', 'full_name email')  .populate('assignment_id', 'title')      
        : await Submission.find(query).populate('user_id', 'full_name email')  .populate('assignment_id', 'title')   
      
      const populatedSubmissions = await submissions
  
      res.status(200).json(populatedSubmissions);     
  
    } catch (error) {       
      res.status(500).json({ message: 'Failed to fetch submissions', error });     
    }   
  }
  
}