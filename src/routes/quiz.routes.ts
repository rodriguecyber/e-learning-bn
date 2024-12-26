import { Router } from 'express';
import { QuizController } from '../controllers/quiz/quiz.controller';
import { QuizAttemptController } from '../controllers/quiz/quiz-attempt.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const quizValidation = [
  body('module_id').isMongoId(),
  body('title').trim().notEmpty(),
  body('pass_percentage').isFloat({ min: 0, max: 100 }),
  body('max_attempts').isInt({ min: 1 }),
  body('time_limit').optional().isInt({ min: 1 })
];

// Protected routes

router.use(authenticateToken);

// Instructor routes
router.post(
  "/",
  
  authorizeRoles("instructor", "admin"),
  quizValidation,
  QuizController.createQuiz
);

router.put(
  "/:id",
  
  authorizeRoles("instructor", "admin"),
  quizValidation,
  QuizController.updateQuiz
);

router.delete(
  "/:id",

  authorizeRoles("instructor", "admin"),
  QuizController.deleteQuiz
);

// Student routes
router.get('/', QuizController.getQuizzes);

router.get('/:id', QuizController.getQuizById);

router.post(
  "/attempts",
  body("quiz_id").isMongoId(),
  
  QuizAttemptController.startQuizAttempt
);

router.post(
  "/attempts/:id/submit",
  body("answers").isObject(),
  
  QuizAttemptController.submitQuizAttempt
);

router.get('/attempts/user', QuizAttemptController.getQuizAttempts);

export default router;