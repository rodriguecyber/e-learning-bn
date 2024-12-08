import { Response } from 'express';
import Submission from '../../models/Submission';
import Assignment from '../../models/Assignment';
import { AuthRequest } from '../../middleware/auth.middleware';

export class SubmissionController {
  static async createSubmission(req: AuthRequest, res: Response) {
    try {
      const { assignment_id } = req.body;
      const assignment = await Assignment.findById(assignment_id);

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      const submission = new Submission({
        ...req.body,
        user_id: req.user?._id,
        status: new Date() > assignment.due_date ? 'late' : 'pending'
      });

      await submission.save();
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create submission', error });
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

  static async getSubmissions(req: AuthRequest, res: Response) {
    try {
      const { assignment_id } = req.query;
      const query: any = { assignment_id };

      if (req.user?.role === 'student') {
        query.user_id = req.user._id;
      }

      const submissions = await Submission.find(query)
        .populate('user_id', 'full_name email')
        .populate('assignment_id', 'title');

      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch submissions', error });
    }
  }
}