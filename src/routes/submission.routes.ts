import { Router } from 'express';
import { SubmissionController } from '../controllers/submission/submission.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';

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
//@ts-expect-error
router.use(authenticateToken);

// Student routes
router.post(
  "/",
  submissionValidation,
  //@ts-expect-error
  SubmissionController.createSubmission
);

// Instructor routes
router.patch(
  "/:id/grade",
  //@ts-expect-error
  authorizeRoles("instructor", "admin"),
  gradeValidation,
  SubmissionController.gradeSubmission
);

// Common routes
router.get('/', SubmissionController.getSubmissions);

export default router;