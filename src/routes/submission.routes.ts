import { Router } from 'express';
import { SubmissionController } from '../controllers/submission/submission.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import upload from '../middleware/upload.middleware';

const router = Router();

// Validation middleware
const submissionValidation = [
  body('assignment_id').isMongoId(),
  body('content').trim().notEmpty(),
  body('file_url').optional().isURL()
];

const gradeValidation = [
  body('score').isFloat({ min: 0 }),
  body('feedback').trim().notEmpty()
];

// Protected routes
router.use(authenticateToken);

// Student routes
router.post(
  "/:assignment_id",
  // submissionValidation,
  upload.single('file'),
  //@ts-expect-error
  SubmissionController.createSubmission
);

// Instructor routes
router.put(
  "/:id/grade",

  authorizeRoles("instructor", "admin"),
  gradeValidation,
  SubmissionController.gradeSubmission
);

// Common routes
router.get('/:assignment_id', SubmissionController.getSubmissions);

export default router;